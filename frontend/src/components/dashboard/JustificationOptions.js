import {
  justificationSvg,
  servicesSvg,
  questionnaireSvg,
} from './Dashboard assets/dashboardSvg';

import { Grid } from '@mui/material';

const JustificationText = ({ router }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6} sx={{ pr: [0, 0, 2], mt: 4 }}>
      <div
        className="treatment-btns w-full h-[72px] text-[16px] bg-white flex cursor-pointer leading-2"
        style={{
          border: '1px solid #D6D8DC',
          borderRadius: '4px',
          wordWrap: 'anywhere',
        }}
        onClick={() => router.push('/dashboard/begruendungstexte')}
      >
        <button
          type="button"
          className="db-button text-white-700 border-none text-white font-medium rounded-[4px] text-sm p-2.5 text-center inline-flex items-center justify-center m-4"
          style={{ width: 40, height: 40 }}
        >
          {justificationSvg}
          <span className="sr-only">Icon description</span>
        </button>
        <span className="icon-btn">Begründungstexte</span>
      </div>
    </Grid>
  );
};

const Services = ({ router }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6} sx={{ pl: [0, 0, 2], mt: 4 }}>
      <div
        className="treatment-btns w-full h-[72px] text-[16px] bg-white flex cursor-pointer leading-2"
        style={{
          border: '1px solid #D6D8DC',
          borderRadius: '4px',
          wordWrap: 'anywhere',
        }}
        onClick={() => router.push('/dashboard/leistungen')}
      >
        <button
          type="button"
          className="db-button text-white-700 border-none text-white font-medium rounded-[4px] text-sm p-2.5 text-center inline-flex items-center justify-center m-4"
          style={{ width: 40, height: 40 }}
        >
          {servicesSvg}
          <span className="sr-only">Icon description</span>
        </button>
        <span className="icon-btn">Leistungen</span>
      </div>
    </Grid>
  );
};

const QuestionnaireEditor = ({ router }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6} sx={{ pr: [0, 0, 2], mt: 4 }}>
      <div
        className="treatment-btns w-full h-[72px] text-[16px] bg-white flex cursor-pointer leading-2"
        style={{
          border: '1px solid #D6D8DC',
          borderRadius: '4px',
          wordWrap: 'anywhere',
        }}
        onClick={() => {
          router.push('/dashboard/questionnaire/edit');
        }}
      >
        <button
          type="button"
          className="db-button text-white-700 border-none text-white font-medium rounded-[4px] text-sm p-2.5 text-center inline-flex items-center justify-center m-4"
          style={{ width: 40, height: 40 }}
        >
          {questionnaireSvg}
          <span className="sr-only">Icon description</span>
        </button>
        <span className="icon-btn">Fragebogeneditor</span>
      </div>
    </Grid>
  );
};
export { JustificationText, Services, QuestionnaireEditor };
