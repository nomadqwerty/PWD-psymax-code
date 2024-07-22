import { Grid, Typography } from '@mui/material';
import Button from '../common/Button';
import CssTextField from '../CssTextField';

const MeetingHeader = () => {
  return (
    <Grid item xs={12} sm={12} md={12} lg={6}>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 36,
          lineHeight: 1.6,
          color: '#3C3C3C',
          fontFamily: 'inter Tight',
        }}
      >
        Videosprechstunde
      </Typography>
    </Grid>
  );
};

const SessionsHeader = () => {
  return (
    <Grid item xs={6} sm={6} md={6} lg={3}>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 26,
          lineHeight: 1.6,
          color: '#3C3C3C',
          fontFamily: 'inter Tight',
          marginBottom: '10px',
        }}
      >
        VideoSessions
      </Typography>
    </Grid>
  );
};

const AddMeeting = ({ router }) => {
  return (
    <Grid item xs={6} sm={6} md={6} lg={3} className="newJustificationBtn">
      <button
        type="button"
        className="h-[59px] bg-[#EEE] px-5 py-2 rounded-[4px] justify-center items-center gap-2.5 inline-flex text-center text-[#0E0E0E] text-sm font-medium interFonts"
        onClick={() => router.push('/dashboard/videosprechstunde/add')}
      >
        Neue Videsession hinzufügen
      </button>
    </Grid>
  );
};

const SearchMeetings = ({ search, setSearch }) => {
  return (
    <Grid item xs={6} sm={6} md={6} lg={3}>
      <CssTextField
        name="Suche"
        type="text"
        focusColor="#3C3C3C"
        id="Suche"
        fullWidth
        label="Suche"
        variant="outlined"
        inputProps={{
          className: 'interFonts',
        }}
        value={search || ''}
        onChange={(event) => {
          const inputValue = event.target.value;
          const alphanumericRegex = /^[a-zA-Z0-9]*$/;
          if (alphanumericRegex.test(inputValue)) {
            console.log(event.target.value, 'search vals');
          }
        }}
      />
    </Grid>
  );
};
const FilterMeetings = ({ search, setSearch }) => {
  return (
    <Grid item xs={6} sm={6} md={6} lg={3}>
      <CssTextField
        name="filter"
        type="text"
        focusColor="#3C3C3C"
        id="filter"
        fullWidth
        label="filter"
        variant="outlined"
        inputProps={{
          className: 'interFonts',
        }}
        value={search || ''}
        onChange={(event) => {
          const inputValue = event.target.value;
          const alphanumericRegex = /^[a-zA-Z0-9]*$/;
          if (alphanumericRegex.test(inputValue)) {
            console.log(event.target.value, 'search vals');
          }
        }}
      />
    </Grid>
  );
};

const Cipher = ({ selectedAll, handleChiffreAll }) => {
  return (
    <div
      className="flex items-center w-full border-[1px] border-[#D6D8DC] radius4 bg-[#d6d8dc40]"
      style={{ marginBottom: '10px' }}
    >
      <div className="xs:w-[6%] sm:w-[6%] md:w-[3%] lg:w-[5%] xl:w-[6%] xs:text-left sm:text-right"></div>
      <div className=" text-[#3C3C3C] font-normal leading-[26px] text-base xs:w-[50%] sm:w-[30%] md:w-[30%] lg:w-[25%] xl:w-[20%]">
        Link
      </div>
      <div className=" text-[#3C3C3C] font-normal leading-[26px] text-base xs:w-[10%] sm:w-[10%] md:w-[10%] lg:w-[10%] xl:w-[10%]">
        Code
      </div>
      <div className=" text-[#3C3C3C] font-normal leading-[26px] text-base xs:w-[10%] sm:w-[10%] md:w-[10%] lg:w-[10%] xl:w-[10%]">
        Datum
      </div>
      <div className=" text-[#3C3C3C] font-normal leading-[26px] text-base xs:w-[10%] sm:w-[10%] md:w-[10%] lg:w-[10%] xl:w-[10%]">
        Uhrzeit
      </div>
      <div className=" text-[#3C3C3C] font-normal leading-[26px] text-base xs:w-[50%] sm:w-[30%] md:w-[30%] lg:w-[25%] xl:w-[20%]">
        Zugewiesen an
      </div>
    </div>
  );
};

const ClickToAddNew = ({ router }) => {
  return (
    <Button
      className="w-full flex font-normal items-center justify-center border-[1px] border-dashed bg-transparent"
      varient="secondary"
      size="md"
      onClick={() => router.push('/dashboard/videosprechstunde/add')}
    >
      Bitte klicken, um eine neue Klient:in hinzuzufügen.
    </Button>
  );
};
export {
  MeetingHeader,
  SearchMeetings,
  AddMeeting,
  FilterMeetings,
  Cipher,
  ClickToAddNew,
  SessionsHeader,
};
