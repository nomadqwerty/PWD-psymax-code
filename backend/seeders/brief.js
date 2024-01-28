const { TemplatesSchema } = require('../models/templatesModel');

const seedBriefData = async () => {
  try {
    // Clear existing data
    await TemplatesSchema.deleteMany();

    const sampleData = [
      {
        templateId: 1,
        name: 'Bericht',
        subject: 'Bericht',
        type: 'brief',
        content: `<div style="color: #707070; font-family: 'Inter Tight', sans-serif; font-size: 16px; font-style: normal; font-weight: 400; line-height: 24px;">
            <p>
                Betrifft Klient:in:<br />
                {{KlientVorname}} {{KlientNachname}}, geb. am: {{KlientGebDatum}} aus
                {{KlientOrt}} ({{KlientPlz}}; {{KlientStrasse}}).
            </p>
            <br />
            <p>
                Anamnese<br />
                Patient:in stellte sich zum Erstgespräch am XX.XX.XXXX mit folgenden
                Symptomen vor: X1[bspw. gedrückte Stimmung], X2, X3.
            </p>
            <br />
            <p>
                Befund(e)<br />
                Die anhaltende Symptomatik verbunden mit dem subjektiven Leidensdruck lässt
                den Schluss auf X4 [bspw. depressives] Erleben und Verhalten (F33.1G) zu.
            </p>
            <br />
            <p>
                Epikritische Bewertung<br />
                Prognostisch günstig zu werten ist, dass die Patient:in durch die bisherige
                psychotherapeutische Behandlung eine Entlastung erfahren und profitieren
                konnte. Bei Ausbleiben der Behandlung ist mit einer deutlichen
                Verschlimmerung und drohende Arbeitslosigkeit zu rechnen.
            </p>
            <br />
            <p>
                Therapieempfehlung<br />
                Aufnahme einer ambulanten Psychotherapie in unserem Hause.
            </p>
        </div>`,
      },
    ];

    // Insert sample data into the database
    await TemplatesSchema.insertMany(sampleData);
  } catch (error) {
    console.error('Error seeding Brief data:', error);
  }
};

module.exports = seedBriefData;
