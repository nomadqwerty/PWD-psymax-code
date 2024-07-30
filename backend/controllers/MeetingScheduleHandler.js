const MeetingSchedule = require('../models/MeetingSchedule');
const { UserSchema } = require('../models/userModel');
const Email = require('./contactUtil/contactUtil');

const meetingHtml = `<html>
  <head>
    <style>
      @font-face {
  font-family: 'Arial';
  font-style: normal;
  font-weight: normal;
  src: url('../../fonts/arial/ARIAL.woff') format('woff');
}

body {
  font-family: 'Arial';
  margin: 0 !important;
  padding: 0 !important;
  -webkit-text-size-adjust: 100% !important;
  -ms-text-size-adjust: 100% !important;
  -webkit-font-smoothing: antialiased !important;
}

img {
  border: 0 !important;
  outline: none !important;
}

p {
  margin: 0px !important;
  padding: 0px !important;
}

table {
  border-collapse: collapse;
  mso-table-lspace: 0px;
  mso-table-rspace: 0px;
}

td,
a,
span {
  border-collapse: collapse;
  mso-line-height-rule: exactly;
}

.defaultlink a {
  color: inherit;
  text-decoration: none;
}

@media only screen and (max-width: 667px) {
  .pb20 {
    padding-bottom: 20px !important;
  }

  .pt20 {
    padding-top: 20px !important;
  }

  u + .body .full_wrap {
    width: 100% !important;
    width: 100vw !important;
  }
}

    </style>
  </head>


  <body>
   
    <table
      width="100%"
      border="0"
      cellspacing="0"
      cellpadding="20"
      align="center"
    >
     

      <tr>
        <td
          class="defaultlink"
          style="
            font-weight: 400;
            color: #3c3c3c;
            font-size: 18px;
            line-height: 26px;
            padding-top: 20px;
            padding-bottom: 25px;
          "
        >
          Hallo
        </td>
      </tr>

      <tr>
        <td
          class="defaultlink"
          style="
            font-weight: 400;
            color: #3c3c3c;
            font-size: 18px;
            line-height: 26px;
            padding-top: 20px;
            padding-bottom: 25px;
          "
        >
          anbei übersende ich Ihnen den Zugangslink für unsere Videosprechstunde
          am {{Name of Day: *day*}}, den {{Datum: *date*}} um {{Uhrzeit in
          *timezone*: *time*}} Uhr.
        </td>
      </tr>

      <tr>
        <td
          class="defaultlink"
          style="
            font-weight: 400;
            color: #3c3c3c;
            font-size: 18px;
            line-height: 26px;
            padding-bottom: 25px;
          "
        >
          {{*URL*}}
        </td>
      </tr>

      <tr>
        <td
          class="defaultlink"
          style="
            font-weight: 400;
            color: #3c3c3c;
            font-size: 18px;
            line-height: 26px;
            padding-bottom: 35px;
          "
        >
          Sie können dem Meeting auch über {{*URL*}} mit folgendem Zugangscode
          beitreten:
        </td>
      </tr>
      <tr>
        <td
          class="defaultlink"
          style="
            font-weight: 400;
            color: #3c3c3c;
            font-size: 18px;
            line-height: 26px;
            padding-bottom: 35px;
          "
        >
          {{*Code*}}
        </td>
      </tr>
      <tr>
        <td
          class="defaultlink"
          style="
            font-weight: 400;
            color: #3c3c3c;
            font-size: 18px;
            line-height: 26px;
            padding-bottom: 35px;
          "
        >
          Freundliche Grüße {{Titel}} {{*Vorname*}} {{*Nachname*}}
        </td>
      </tr>

      <tr>
        <td
          class="defaultlink"
          style="
            font-weight: 400;
            color: #2b86fc;
            font-size: 14px;
            line-height: 26px;
          "
        >
          
        </td>
      </tr>
      <tr>
        <td
          class="defaultlink"
          style="
            font-weight: 400;
            color: #707070;
            font-size: 18px;
            line-height: 26px;
            padding-bottom: 35px;
          "
        >
        {{RotatedText}}
        </td>
      </tr>
    </table>
  </body>
</html>
`;

exports.getMeetingDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    const meetings = await MeetingSchedule.find({ userId: userId });
    if (meetings) {
      let detailObject = {
        status: 'success',
        data: { meetings },
      };

      return res.status(200).json(detailObject);
    } else {
      throw new Error('failed to create meeting schedule');
    }
  } catch (error) {
    let errorObject = {
      status: 'failed',
      message: error.message,
    };

    return res.status(400).json(errorObject);
  }
};

exports.storeMeetingDetails = async (req, res) => {
  try {
    const meetingDetails = req.body;
    const days = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday',
    };

    let patientEmail = meetingHtml;
    if (meetingDetails.userId) {
      const user = await UserSchema.findById(meetingDetails.userId);

      let day = new Date(meetingDetails.Geburtsdatum).getDay();
      let dayNum = new Date(meetingDetails.Geburtsdatum).getDay();
      const month = new Date(meetingDetails.Geburtsdatum).getMonth() + 1;
      const year = new Date(meetingDetails.Geburtsdatum).getFullYear();
      const meetingLink = meetingDetails.url;
      const meetingKey = meetingDetails.accessKey;
      const vorname = meetingDetails.Vorname;
      const nachname = meetingDetails.Nachname;
      const time = `${meetingDetails.meetingTime.hour}:${meetingDetails.meetingTime.minute || '00'}`;
      const dateFormat = new Intl.DateTimeFormat('de', {
        timeZone: 'Europe/Berlin',
        timeZoneName: 'short',
      });
      const timeZone = dateFormat
        .format(new Date(meetingDetails.Geburtsdatum))
        .split(',')[1];

      day = days[day];

      let rotatedText = `${user?.Praxistitel} ${
        user?.Praxisbeschreibung
      }  ${user?.Praxistitel || user?.Praxisbeschreibung ? '∙' : ''} <br />${
        user?.Titel
      } ${user?.Vorname} ${user?.Nachname} ∙ <br /> ${
        user?.Strasse_und_Hausnummer
      } ${user?.Strasse_und_Hausnummer ? '∙' : ''} <br />${user?.Ort} ${
        user?.PLZ
      } ∙ <br />Telefon ${user?.Telefon} <br />${user?.email} ${user?.Website}`;
      console.log(rotatedText);

      patientEmail = patientEmail.replace('*day*', `${day}`);
      patientEmail = patientEmail.replace(
        '*date*',
        `${dayNum}.${month}.${year}`
      );
      patientEmail = patientEmail.replace('*timezone*', `${timeZone}`);
      patientEmail = patientEmail.replace('*time*', `${time}`);
      patientEmail = patientEmail.replaceAll('{{*URL*}}', `{{${meetingLink}}}`);
      patientEmail = patientEmail.replace('{{*Code*}}', `{{${meetingKey}}}`);
      patientEmail = patientEmail.replace(
        '{{*Vorname*}} {{*Nachname*}}',
        `{{${vorname}}} {{${nachname}}}`
      );
      let contactObject = {
        email: meetingDetails.email,
        name: 'psymax',
      };
      patientEmail = patientEmail.replace('{{RotatedText}}', rotatedText);
      const mailer = new Email(contactObject);
      let sent = await mailer.sendHtml('Meeting Scheduled', patientEmail);

      const newMeeting = await MeetingSchedule.create(meetingDetails);
      if (newMeeting) {
        let detailObject = {
          status: 'success',
          message: 'created meeting schedule',
        };

        return res.status(200).json(detailObject);
      } else {
        throw new Error('failed to create meeting schedule');
      }
    }
  } catch (error) {
    console.log(error);
    let errorObject = {
      status: 'failed',
      message: error.message,
    };

    return res.status(400).json(errorObject);
  }
};

exports.deleteMeetingDetails = async (req, res) => {
  try {
    const meetingId = req.params?.meetingId;
    console.log(meetingId);
    console.log(req.body);
    const removedMeeting = await MeetingSchedule.findOneAndDelete({
      _id: meetingId,
    });

    if (removedMeeting) {
      let detailObject = {
        status: 'success',
        message: 'removed meeting schedule',
      };

      return res.status(204).json(detailObject);
    } else {
      throw new Error('failed to remove meeting schedule');
    }
  } catch (error) {
    let errorObject = {
      status: 'failed',
      message: error.message,
    };

    return res.status(400).json(errorObject);
  }
};
