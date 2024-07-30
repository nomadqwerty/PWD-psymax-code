import {
  documentAndServiceSvg,
  clientSvg,
  schedulingSvg,
  VideoConsultationSvg,
  documentTemplateSvg,
} from './Dashboard assets/dashboardSvg';
import { Grid } from '@mui/material';

const DocumentAndService = ({ router }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6} sx={{ pr: [0, 0, 2], mt: 4 }}>
      <div
        className="treatment-btns w-full h-[72px] text-[16px] bg-white flex cursor-pointer leading-2"
        style={{
          border: '1px solid #D6D8DC',
          borderRadius: '4px',
          wordWrap: 'anywhere',
        }}
      >
        <button
          type="button"
          className="db-button text-white-700 border-none text-white font-medium rounded-[4px] text-sm p-2.5 text-center inline-flex items-center justify-center m-4"
          style={{ width: 40, height: 40 }}
        >
          {documentAndServiceSvg}

          <span className="sr-only">Icon description</span>
        </button>
        <span className="icon-btn">Dokumentation & Leistungsverbuchung</span>
      </div>
    </Grid>
  );
};

const Client = ({ router }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6} sx={{ pl: [0, 0, 2], mt: 4 }}>
      <div
        className="treatment-btns w-full h-[72px] text-[16px] bg-white flex cursor-pointer leading-2"
        style={{
          border: '1px solid #D6D8DC',
          borderRadius: '4px',
          wordWrap: 'anywhere',
        }}
        onClick={() => router.push('/dashboard/klientinnen')}
      >
        <button
          type="button"
          className="db-button text-white-700 border-none text-white font-medium rounded-[4px] text-sm p-2.5 text-center inline-flex items-center justify-center m-4"
          style={{ width: 40, height: 40 }}
        >
          {clientSvg}
          <span className="sr-only">Icon description</span>
        </button>
        <span className="icon-btn">Klient:innen</span>
      </div>
    </Grid>
  );
};

const Scheduling = ({ router }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6} sx={{ pr: [0, 0, 2], mt: 4 }}>
      <div
        className="treatment-btns w-full h-[72px] text-[16px] bg-white flex cursor-pointer leading-2"
        style={{
          border: '1px solid #D6D8DC',
          borderRadius: '4px',
          wordWrap: 'anywhere',
        }}
      >
        <button
          type="button"
          className="db-button text-white-700 border-none text-white font-medium rounded-[4px] text-sm p-2.5 text-center inline-flex items-center justify-center m-4"
          style={{ width: 40, height: 40 }}
        >
          {schedulingSvg}
          <span className="sr-only">Icon description</span>
        </button>
        <span className="icon-btn">Terminplanung</span>
      </div>
    </Grid>
  );
};

const VideoConsultation = ({ router }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6} sx={{ pl: [0, 0, 2], mt: 4 }}>
      <div
        className="treatment-btns w-full h-[72px] text-[16px] bg-white flex cursor-pointer leading-2"
        style={{
          border: '1px solid #D6D8DC',
          borderRadius: '4px',
          wordWrap: 'anywhere',
        }}
        onClick={() => router.push('/dashboard/videosprechstunde')}
      >
        <button
          type="button"
          className="db-button text-white-700 border-none text-white font-medium rounded-[4px] text-sm p-2.5 text-center inline-flex items-center justify-center m-4"
          style={{ width: 40, height: 40 }}
          onClick={() => {
            console.log('object');
            router.push('/videoconsultation');
          }}
        >
          {VideoConsultationSvg}
          <span className="sr-only">Icon description</span>
        </button>
        <span className="icon-btn">Videosprechstunde</span>
      </div>
    </Grid>
  );
};

const DocumentTemplate = ({ router }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6} sx={{ pr: [0, 0, 2], mt: 4 }}>
      <div
        className="treatment-btns w-full h-[72px] text-[16px] bg-white flex cursor-pointer leading-2"
        style={{
          border: '1px solid #D6D8DC',
          borderRadius: '4px',
          wordWrap: 'anywhere',
        }}
        onClick={() => router.push('/dashboard/dokumentenvorlage')}
      >
        <button
          type="button"
          className="db-button text-white-700 border-none text-white font-medium rounded-[4px] text-sm p-2.5 text-center inline-flex items-center justify-center m-4"
          style={{ width: 40, height: 40 }}
        >
          {documentTemplateSvg}
          <span className="sr-only">Icon description</span>
        </button>
        <span className="icon-btn">Dokumentenvorlage</span>
      </div>
    </Grid>
  );
};

export {
  DocumentAndService,
  Client,
  Scheduling,
  VideoConsultation,
  DocumentTemplate,
};
