import { Grid, InputAdornment } from '@mui/material';
import Button from '../common/Button';
import CssTextField from '../CssTextField';

const GlobalPointValue = ({
  globalPoint,
  setGlobalPoint,
  handleGlobalPointBlur,
}) => {
  return (
    <Grid item xs={6} sm={6} md={6} lg={3} className="newJustificationBtn">
      <CssTextField
        name="GlobalerPunktwert"
        type="number"
        focusColor="#3C3C3C"
        id="GlobalerPunktwert"
        fullWidth
        label="Globaler Punktwert"
        variant="outlined"
        inputProps={{
          className: 'interFonts',
        }}
        value={parseFloat(globalPoint) || ''}
        InputProps={{
          endAdornment: <InputAdornment position="end">€</InputAdornment>,
        }}
        onChange={(event) => {
          const newValue = parseFloat(event.target.value) || 0;
          setGlobalPoint(newValue);
        }}
        onBlur={handleGlobalPointBlur}
      />
    </Grid>
  );
};

const Search = ({ search, setSearch }) => {
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
            setSearch(inputValue);
          }
        }}
      />
    </Grid>
  );
};

const AddService = ({ router }) => {
  return (
    <Button
      className="mt-[24px] w-full flex font-normal items-center justify-center border-[1px] border-dashed bg-transparent"
      varient="secondary"
      size="md"
      onClick={() => router.push('/dashboard/leistungen/abrechnung/add')}
    >
      Bitte klicken, um eine neue Leistung hinzuzufügen
    </Button>
  );
};

const Return = ({ router }) => {
  return (
    <Button
      className="mt-[24px] w-full flex font-normal items-center justify-center border-[1px] border-dashed bg-transparent"
      varient="secondary"
      size="md"
      onClick={() => router.push('/dashboard/leistungen/terminplanung/add')}
    >
      Bitte klicken, um eine neue Leistung hinzuzufügen
    </Button>
  );
};

export { GlobalPointValue, Search, AddService, Return };
