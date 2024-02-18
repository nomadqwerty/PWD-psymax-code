import { Grid } from "@mui/material";
import { useRouter } from "next/navigation";

const SubmitBtn = ({ isSubmitting }) => {
  const router = useRouter();
  return (
    <Grid container sx={{ mt: 4 }}>
      <Grid item xs={6} sm={6} md={6} xl={6} style={{ textAlign: "left" }}>
        <button
          type="button"
          className="w-107 h-[42px] bg-[#EEE] px-5 py-2 rounded-[4px] justify-center items-center gap-2.5 inline-flex text-center text-[#0E0E0E] text-sm font-medium interFonts"
          onClick={() => router.back()}
        >
          Zurück
        </button>
      </Grid>
      <Grid item xs={6} sm={6} md={6} xl={6} style={{ textAlign: "right" }}>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-107 h-[42px] bg-[#EEE] px-5 py-2 rounded-[4px] justify-center items-center gap-2.5 inline-flex text-center text-[#0E0E0E] text-sm font-medium interFonts"
        >
          Bestätigen
        </button>
      </Grid>
    </Grid>
  );
};

export default SubmitBtn;
