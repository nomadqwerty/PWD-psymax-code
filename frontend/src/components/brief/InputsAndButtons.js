import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import CssTextField from "../CssTextField";
import dynamic from "next/dynamic";

const Recipient = ({
  Controller,
  control,
  register,
  errors,
  handleEmpfaenger,
}) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <FormControl sx={{ mt: 4 }} fullWidth>
        <InputLabel
          id="Empfaenger"
          className="text-md"
          sx={{
            fontStyle: "normal",
            fontWeight: 400,
          }}
        >
          Empfänger
        </InputLabel>
        <Controller
          name="Empfaenger"
          control={control}
          render={({ field }) => (
            <Select
              labelId="Empfaenger"
              label="Empfaenger"
              fullWidth
              {...field}
              error={!!errors.Empfaenger}
              {...register("Empfaenger", { required: true })}
              onChange={(e) => handleEmpfaenger(e?.target?.value)}
              value={field.value || ""}
            >
              <MenuItem value={"klient"} key={`klient`}>
                Klient:in
              </MenuItem>
              <MenuItem value={"arzt"} key={`arzt`}>
                Betreuender Arzt
              </MenuItem>
            </Select>
          )}
        />
        {errors?.Empfaenger && (
          <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
        )}
      </FormControl>
    </Grid>
  );
};

const LetterTemplate = ({
  Controller,
  control,
  register,
  briefData,
  templates,
  errors,
  handleBriefvorlageChange,
}) => {
  return (
    <Grid item xs={12} sm={12} md={6} xl={6}>
      <FormControl sx={{ mt: 4 }} fullWidth>
        <InputLabel
          id="Briefvorlage"
          className="text-md"
          sx={{
            fontStyle: "normal",
            fontWeight: 400,
          }}
        >
          Briefvorlage
        </InputLabel>
        <Controller
          name="Briefvorlage"
          control={control}
          render={({ field }) => (
            <Select
              labelId="Briefvorlage"
              label="Briefvorlage"
              fullWidth
              {...field}
              error={!!errors.Briefvorlage}
              {...register("Briefvorlage")}
              onChange={(e) => {
                handleBriefvorlageChange(e?.target?.value);
              }}
              value={field.value || ""}
            >
              {briefData?.Empfaenger && (
                <MenuItem value={"none"}>None</MenuItem>
              )}
              {templates?.map((item, i) => {
                return (
                  <MenuItem key={i} value={item?.templateId}>
                    {item?.name}
                  </MenuItem>
                );
              })}
            </Select>
          )}
        />
      </FormControl>
    </Grid>
  );
};

const Reference = ({ register, errors, briefData, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={12} xl={12}>
      <CssTextField
        name="Betreff"
        sx={{ mt: [2, 0, 2] }}
        type="text"
        focusColor="#3C3C3C"
        id="Betreff"
        fullWidth
        label="Betreff"
        variant="outlined"
        {...register("Betreff", { required: true })}
        error={!!errors.Betreff}
        inputProps={{
          className: "interFonts",
        }}
        value={briefData?.Betreff || ""}
        onChange={(e) => handleChange("Betreff", e?.target?.value)}
      />

      {errors?.Betreff && (
        <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
      )}
    </Grid>
  );
};

const LetterEditor = ({
  Controller,
  control,
  register,
  editor,
  handleChange,
  errors,
}) => {
  const DynamicJoditEditor = dynamic(() => import("jodit-react"), {
    ssr: false,
  });
  return (
    <Grid item xs={12} sx={{ mt: [2, 0, 2] }}>
      <Controller
        name="Inhalt"
        control={control}
        render={({ field }) => (
          <DynamicJoditEditor
            // ref={editor}
            config={{
              placeholder: "Inhalt",
              readonly: false,
              toolbarAdaptive: false,
              buttons: [
                "bold",
                "italic",
                "underline",
                "|",
                "ul",
                "ol",
                "align",
                "|",
              ],
              statusbar: false,
            }}
            onBlur={(text) => {
              field.onChange(text);
              handleChange("Inhalt", text);
            }}
            value={field.value || ""}
          />
        )}
      />

      {errors?.Inhalt && (
        <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
      )}
    </Grid>
  );
};

const SignatureFieldA = ({ register, errors, briefData, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={12} xl={12}>
      <CssTextField
        name="Unterschriftsfeld1"
        sx={{ mt: [2, 0, 2] }}
        type="text"
        focusColor="#3C3C3C"
        id="Unterschriftsfeld1"
        fullWidth
        label="Unterschriftsfeld 1"
        variant="outlined"
        {...register("Unterschriftsfeld1", { required: true })}
        error={!!errors.Unterschriftsfeld1}
        inputProps={{
          className: "interFonts",
        }}
        value={briefData?.Unterschriftsfeld1 || ""}
        onChange={(e) => handleChange("Unterschriftsfeld1", e?.target?.value)}
      />

      {errors?.Unterschriftsfeld1 && (
        <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
      )}
    </Grid>
  );
};

const SignatureFieldB = ({ register, errors, briefData, handleChange }) => {
  return (
    <Grid item xs={12} sm={12} md={12} xl={12}>
      <CssTextField
        name="Unterschriftsfeld2"
        sx={{ mt: [2, 0, 2] }}
        type="text"
        focusColor="#3C3C3C"
        id="Unterschriftsfeld2"
        fullWidth
        label="Unterschriftsfeld 2"
        variant="outlined"
        {...register("Unterschriftsfeld2", { required: true })}
        error={!!errors.Unterschriftsfeld2}
        inputProps={{
          className: "interFonts",
        }}
        value={briefData?.Unterschriftsfeld2 || ""}
        onChange={(e) => handleChange("Unterschriftsfeld2", e?.target?.value)}
      />

      {errors?.Unterschriftsfeld2 && (
        <span className="validationErr">Dieses Feld ist ein Pflichtfeld</span>
      )}
    </Grid>
  );
};

const Cancel = ({ router }) => {
  return (
    <Grid item xs={6} sm={6} md={6} xl={6} style={{ textAlign: "left" }}>
      <button
        type="button"
        className="w-107 h-[42px] bg-[#FBD6D8] text-[#E30C40] hover:bg-[#E30C40] hover:text-[#fff] px-5 py-2 rounded-[4px] justify-center items-center gap-2.5 inline-flex text-center text-sm font-medium interFonts"
        onClick={() => router.back()}
      >
        Abbrechen
      </button>
    </Grid>
  );
};

const Confirm = ({ isSubmitting }) => {
  return (
    <Grid item xs={6} sm={6} md={6} xl={6} style={{ textAlign: "right" }}>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-107 h-[42px] bg-[#EEE] text-[#0E0E0E] hover:bg-[#2B86FC] hover:text-[#FFFFFF]  px-5 py-2 rounded-[4px] justify-center items-center gap-2.5 inline-flex text-center text-sm font-medium interFonts"
      >
        Bestätigen
      </button>
    </Grid>
  );
};

export {
  Recipient,
  LetterTemplate,
  Reference,
  LetterEditor,
  SignatureFieldA,
  SignatureFieldB,
  Cancel,
  Confirm,
};
