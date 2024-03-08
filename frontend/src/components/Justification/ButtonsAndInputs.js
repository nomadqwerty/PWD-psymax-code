import { Grid } from '@mui/material';
import CssTextField from '../CssTextField';
import Button from '../common/Button';

const AddJustification = () => {
  return (
    <Grid item xs={6} sm={6} md={6} lg={3} className="newJustificationBtn">
      <button
        type="button"
        className="h-[59px] bg-[#EEE] px-5 py-2 rounded-[4px] justify-center items-center gap-2.5 inline-flex text-center text-[#0E0E0E] text-sm font-medium interFonts"
        onClick={() => addJustification()}
      >
        Neue Begründung hinzufügen
      </button>
    </Grid>
  );
};

const JustificationInput = ({ search, setSearch }) => {
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
        value={search}
        onChange={(event) => {
          const inputValue = event.target.value;
          const alphanumericRegex = /^[a-zA-Z0-9]*$/;
          if (alphanumericRegex.test(inputValue)) {
            setSearch(event.target.value);
          }
        }}
      />
    </Grid>
  );
};

const AddReason = ({ addJustification }) => {
  return (
    <Button
      className="mt-[24px] w-full flex font-normal items-center justify-center border-[1px] border-dashed bg-transparent"
      varient="secondary"
      size="md"
      onClick={() => addJustification()}
    >
      Bitte klicken, um eine neue Begründung hinzuzufügen.
    </Button>
  );
};

const Return = ({ router }) => {
  return (
    <Grid item xs={3} sm={3} md={2} lg={1} className="text-left ">
      <Button
        varient="primary"
        size="sm"
        className="px-4"
        onClick={() => router.back()}
      >
        Zurück
      </Button>
    </Grid>
  );
};

const Submit = ({ handleSubmit }) => {
  return (
    <Grid item xs={3} sm={3} md={2} lg={1} className="text-right">
      <Button
        varient="primary"
        size="sm"
        className="px-4"
        onClick={handleSubmit}
      >
        Bestätigen
      </Button>
    </Grid>
  );
};

export { AddJustification, JustificationInput, AddReason, Return, Submit };
