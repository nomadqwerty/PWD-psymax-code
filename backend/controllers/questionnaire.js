const path = require('path');
const fs = require('fs');

const { generatePDF, sendSMTPMail } = require('../utils/common');

const UserModel = require('../models/userModel');
const QuestionnaireModel = require('../models/questionnaireModel');
const QuestionnaireResponseModel = require('../models/questionnaireResponseModel');

exports.getAll = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const questionnaires = await QuestionnaireModel.find({ userId });

    if (!questionnaires) {
      return res.status(404).json({
        status: 'fail',
        message: 'Daten nicht gefunden',
      });
    }
    res.status(200).json({
      status: 'success',
      questionnaires,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

exports.getOne = async (req, res) => {
  // when creating a new questionnaire, the id is 'new'
  if (req.params.id === 'new') {
    return res.status(200).json({
      status: 'ready',
    });
  }

  try {
    const questionnaire = await QuestionnaireModel.findById(req.params.id);

    if (!questionnaire) {
      return res.status(404).json({
        status: 'fail',
        message: 'Daten nicht gefunden',
      });
    }
    res.status(200).json({
      status: 'success',
      questionnaire,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

exports.save = async (req, res) => {
  const userId = req.user.user_id;
  const { name, questions, randomizeQuestions, scale } = req.body;

  try {
    const newQuestionnaire = await QuestionnaireModel.create({
      userId,
      name,
      questions,
      randomizeQuestions,
      scale,
    });

    res.status(201).json({
      status: 'success',
      questionnaire: newQuestionnaire,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.user_id;
  const { name, questions, randomizeQuestions, scale } = req.body;

  try {
    if (!id || id === 'new') {
      const newQuestionnaire = await QuestionnaireModel.create({
        userId,
        name,
        questions,
        randomizeQuestions,
        scale,
      });
      return res.status(201).json({
        status: 'success',
        message: 'Questionnaire created!',
        questionnaire: newQuestionnaire,
      });
    }

    const updatedQuestionnaire = await QuestionnaireModel.findOneAndUpdate(
      { _id: id },
      { name, questions, randomizeQuestions, scale },
      {
        new: true,
        runValidators: true,
        upsert: true,
      }
    );

    if (!updatedQuestionnaire) {
      return res.status(404).json({
        status: 'fail',
        message: 'Daten nicht gefunden',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Questionnaire updated',
      questionnaire: updatedQuestionnaire,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

exports.updateMany = async (req, res) => {
  const { questionnaires } = req.body;

  try {
    /**
     * Updates multiple questionnaires in the database.
     *
     * @param {Array<Object>} questionnaires - The array of questionnaires to be updated.
     * @returns {Promise<Array<Object>>} - The array of updated questionnaires.
     */
    const updatedQuestionnaires = await Promise.all(
      questionnaires.map(async (questionnaire) => {
        const updatedQuestionnaire = await QuestionnaireModel.findOneAndUpdate(
          { _id: questionnaire._id },
          questionnaire,
          {
            new: true,
            runValidators: true,
            // create a new document if it doesn't exist
            upsert: true,
          }
        );

        return updatedQuestionnaire;
      })
    );

    if (!updatedQuestionnaires) {
      return res.status(404).json({
        status: 'fail',
        message: 'Daten nicht gefunden',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Questionnaires updated',
      questionnaires: updatedQuestionnaires,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const deletedQuestionnaire = await QuestionnaireModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedQuestionnaire) {
      return res.status(404).json({
        status: 'fail',
        message: 'Daten nicht gefunden',
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'Daten gelöscht',
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

exports.getAllResponses = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const responses = await QuestionnaireResponseModel.find({ user: userId });

    if (!responses) {
      return res.status(404).json({
        status: 'fail',
        message: 'Daten nicht gefunden',
      });
    }

    res.status(200).json({
      status: 'success',
      responses,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

exports.getOneResponse = async (req, res) => {
  const { accessCode } = req.params;

  try {
    const response = await QuestionnaireResponseModel.findOne({ accessCode });

    if (!response) {
      return res.status(404).json({
        status: 'fail',
        message: 'Ungültiger Zugangscode',
      });
    }

    res.status(200).json({
      status: 'success',
      response,
    });
  } catch (error) {
    console.log(error);

    res.status(404).json({
      status: 'fail',
      message: 'Daten nicht gefunden',
    });
  }
};

exports.saveResponse = async (req, res) => {
  // required all fields: questionnaire, klient, user, accessCode, responses {questionId, answer}, isCompleted
  const { questionnaire, klient, user, accessCode, responses } = req.body;

  try {
    const newResponse = await QuestionnaireResponseModel.findOneAndUpdate(
      {
        questionnaire,
        user,
        klient,
      },
      {
        questionnaire,
        klient,
        user,
        accessCode,
        responses,
        isCompleted: true,
      },
      {
        new: true,
        runValidators: true,
        upsert: true,
      }
    );

    res.status(201).json({
      status: 'success',
      message: 'Response saved!',
      response: newResponse,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

exports.downloadResponsePDFs = async (req, res) => {
  const { clientIds } = req.body;

  if (!clientIds) {
    return res.status(400).json({
      status: 'fail',
      message: 'Bad request',
    });
  }

  let client, questionnaire, questions, questionScale, responses;

  // create an array to store the pdf data
  let pdfData = [];

  for (let i = 0; i < clientIds.length; i++) {
    try {
      const response = await QuestionnaireResponseModel.findOne({
        _id: clientIds[i],
      });

      if (!response) continue;

      // dateSubmitted:
      client = response?.klient; //chiffre, vorname, nachname
      questionnaire = response?.questionnaire; // name
      questions = response?.questionnaire?.questions; // id, question, isRating
      questionScale = response?.questionnaire?.scale; // name, value
      responses = response?.responses; // response, questionId
    } catch (error) {
      console.log(error);
    }

    const pdfsFolderPath = path.join('public', 'pdfs');

    if (!fs.existsSync(pdfsFolderPath)) {
      fs.mkdirSync(pdfsFolderPath);
    }

    const pdfName = `${client?.Vorname}_${
      client?.Nachname
    }_antwort_${Date.now()}.pdf`;
    const pdfFilePath = pdfsFolderPath + pdfName;

    let htmlTemplate = fs.readFileSync(
      path.join('html', 'pdfs', 'questionnaireResponse.html'),
      'utf-8'
    );

    htmlTemplate = htmlTemplate
      .replace(/{{Fragebogen}}/g, questionnaire?.name)
      .replace(/{{Date}}/g, new Date().toLocaleDateString())
      .replace(/{{Chiffre}}/g, client?.Chiffre)
      .replace(/{{Vorname}}/g, client?.Vorname)
      .replace(/{{Nachname}}/g, client?.Nachname);

    let answerRows = [];
    let scaleSum = 0;
    let totalRatingQuestions = 0;

    responses?.forEach((response, index) => {
      const question = questions.find((q) => q.id === response?.questionId);

      scaleSum += +response?.value;
      if (question?.isRating) totalRatingQuestions += 1;

      answerRows.push(
        `<tr>
          <td>#${(index + 1).toString().padStart(3, '0')}</td>
          <td style="width: 50%">${question?.question}</td>
          ${
            question?.isRating
              ? `<td style="width: 1rem; text-align: center;">${response?.value}</td>
                <td> ${response?.answer}</td>`
              : `<td style="width: 1rem;"></td>
                <td>${response?.answer}</td>`
          }
        </tr>`
      );
    });

    const scaleMean = (scaleSum / totalRatingQuestions).toFixed(2);

    htmlTemplate = htmlTemplate
      .replace(/{{QuestionnaireResponses}}/g, answerRows.join(''))
      .replace(/{{Sum}}/g, scaleSum)
      .replace(/{{Mean}}/g, scaleMean || 0);

    const userId = req.user.user_id;

    // add user details as rotated text to the pdf
    const user = UserModel.UserSchema.findOne({ _id: userId });
    const rotatedText = `${user?.Praxistitel || ''} ${
      user?.Praxisbeschreibung || ''
    } ∙ ${user?.Titel || ''} ${user?.Vorname || ''} ${user?.Nachname || ''} ∙ ${
      user?.Strasse_und_Hausnummer || ''
    } ∙ ${user?.Ort || ''} ∙ Telefon ${user?.Telefon || ''} ${
      user?.Email || ''
    } ${user?.Website || ''}`;

    htmlTemplate = htmlTemplate.replace(/{{RotatedText}}/g, rotatedText);

    try {
      let file = await generatePDF(
        htmlTemplate,
        pdfName,
        pdfFilePath,
        '',
        '',
        '',
        ''
      );

      if (file) {
        var bitmap = await fs.promises.readFile(pdfFilePath);
        // convert binary file to base64 encoded string
        let base64Pdf = Buffer.from(bitmap).toString('base64');

        if (fs.existsSync(pdfFilePath)) {
          fs.unlinkSync(pdfFilePath);
        }

        // push the pdf data to the array
        pdfData.push({ base64Pdf, fileName: pdfName });
      }
    } catch (error) {
      console.log(error);
    }
  }

  // check if the pdf data array is not empty
  if (pdfData.length > 0) {
    // send the pdf data array as the response
    let response = {
      status_code: 200,
      message: 'Export erfolgreich',
      data: pdfData,
    };
    return res.status(200).send(response);
  } else {
    // handle the case when no pdf files were generated
    return res.status(500).json({
      message: 'Conversion failed!',
    });
  }
};
