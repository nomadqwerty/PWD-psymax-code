import { Grid } from "@mui/material";
import CssTextField from "../../CssTextField";

const Gopnr = ({ register, errors, getValues, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="GopNr"
        sx={{
          mt: 4,
        }}
        type="text"
        focusColor="#3C3C3C"
        color="primary"
        id="GopNr"
        fullWidth
        label="GOP-Nr."
        variant="outlined"
        {...register("GopNr", { required: true })}
        error={!!errors.GopNr}
        InputLabelProps={{
          shrink: !!getValues("GopNr"),
        }}
        inputProps={{
          className: "interFonts",
        }}
        onChange={handleChange}
      />
      {errors?.GopNr && (
        <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
      )}
    </Grid>
  );
};

const PointValue = ({ register, errors, getValues, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="Punktwert"
        sx={{ mt: [2, 0, 4] }}
        type="number"
        focusColor="#3C3C3C"
        id="Punktwert"
        fullWidth
        label="Punktwert"
        variant="outlined"
        {...register("Punktwert", { required: true })}
        error={!!errors.Punktwert}
        InputLabelProps={{
          shrink: !!getValues("Punktwert"),
        }}
        inputProps={{
          className: "interFonts",
        }}
        onChange={handleChange}
      />
      {errors?.Punktwert && (
        <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
      )}
    </Grid>
  );
};

const ServiceDescription = ({ register, errors, getValues, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={12} xl={12}>
      <CssTextField
        multiline
        rows={6}
        name="Leistungsbeschreibung"
        sx={{ mt: [2, 0, 2] }}
        type="text"
        focusColor="#3C3C3C"
        color="primary"
        id="Leistungsbeschreibung"
        fullWidth
        label="Leistungsbeschreibung"
        variant="outlined"
        {...register("Leistungsbeschreibung", { required: true })}
        InputLabelProps={{
          shrink: !!getValues("Leistungsbeschreibung"),
        }}
        error={!!errors.Leistungsbeschreibung}
        inputProps={{
          className: "interFonts",
        }}
        onChange={handleChange}
      />
      {errors?.Leistungsbeschreibung && (
        <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
      )}
    </Grid>
  );
};

const StandardNumber = ({ register, errors, getValues, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        key="Standardanzahl"
        name="Standardanzahl"
        sx={{ mt: 2 }}
        type="number"
        fullWidth
        label="Standardanzahl"
        variant="outlined"
        {...register("Standardanzahl", { required: true })}
        InputLabelProps={{
          shrink: !!getValues("Standardanzahl"),
        }}
        error={!!errors.Standardanzahl}
        InputProps={{
          className: "interFonts",
        }}
        onChange={handleChange}
      />

      {errors?.Standardanzahl && (
        <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
      )}
    </Grid>
  );
};

const StandardFactor = ({ register, errors, getValues, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="Standardfaktor"
        sx={{ mt: [2, 0, 2] }}
        type="number"
        focusColor="#3C3C3C"
        id="Standardfaktor"
        fullWidth
        label="Standardfaktor"
        variant="outlined"
        {...register("Standardfaktor", { required: true })}
        InputLabelProps={{
          shrink: !!getValues("Standardfaktor"),
        }}
        error={!!errors.Standardfaktor}
        inputProps={{
          className: "interFonts",
        }}
        onChange={handleChange}
      />
      {errors?.Standardfaktor && (
        <span className="validationErr pl-2">
          Dieses Feld ist ein Pflichtfeld
        </span>
      )}
    </Grid>
  );
};

const Amount = ({ register, errors, getValues, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        disabled
        name="Betrag"
        sx={{ mt: 2 }}
        type="text"
        focusColor="#3C3C3C"
        id="Betrag"
        fullWidth
        label="Betrag"
        variant="outlined"
        {...register("Betrag")}
        error={!!errors.Betrag}
        InputLabelProps={{
          shrink: !!getValues("Betrag"),
        }}
        inputProps={{
          className: "interFonts",
        }}
        onChange={handleChange}
      />
    </Grid>
  );
};

const ManualAmount = ({ register, errors, getValues, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <CssTextField
        name="ManuellerBetrag"
        sx={{ mt: [2, 0, 2] }}
        type="number"
        focusColor="#3C3C3C"
        id="ManuellerBetrag"
        fullWidth
        label="Manueller Betrag"
        variant="outlined"
        {...register("ManuellerBetrag", {
          required: "Dieses Feld ist ein Pflichtfeld",
        })}
        error={!!errors.ManuellerBetrag}
        InputLabelProps={{
          shrink: !!getValues("ManuellerBetrag"),
        }}
        inputProps={{
          className: "interFonts",
        }}
        onChange={handleChange}
      />
      {errors?.ManuellerBetrag && (
        <span className="validationErr pl-2">
          {errors?.ManuellerBetrag?.message}
        </span>
      )}
    </Grid>
  );
};

export {
  Gopnr,
  PointValue,
  ServiceDescription,
  StandardNumber,
  StandardFactor,
  Amount,
  ManualAmount,
};
