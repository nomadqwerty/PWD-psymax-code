import { Grid, Typography } from '@mui/material';

const BriefHeader = () => {
  return (
    <Grid container sx={{ mb: 4 }}>
      <Grid item xs={12}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 36,
            lineHeight: 1.6,
            color: '#363F4A',
            fontFamily: 'inter Tight',
          }}
        >
          Brief
        </Typography>
      </Grid>
    </Grid>
  );
};

const Options = ({ handleBriefAction }) => {
  return (
    <>
      <div
        className="flex items-center mt-5 cursor-pointer"
        onClick={() => handleBriefAction(1)}
      >
        <svg
          className="mr-2"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 3.99951V22.9995"
            stroke="#2B86FC"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 13.9995L16 22.9995L25 13.9995"
            stroke="#2B86FC"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 26.9995H27"
            stroke="#2B86FC"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span className="text-[#2B86FC] interFonts text-base font-medium">
          Download als PDF
        </span>
      </div>
      <div
        className="flex items-center mt-2 cursor-pointer"
        onClick={() => handleBriefAction(2)}
      >
        <svg
          className="mr-2"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M28 7L16 18L4 7"
            stroke="#2B86FC"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 7H28V24C28 24.2652 27.8946 24.5196 27.7071 24.7071C27.5196 24.8946 27.2652 25 27 25H5C4.73478 25 4.48043 24.8946 4.29289 24.7071C4.10536 24.5196 4 24.2652 4 24V7Z"
            stroke="#2B86FC"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.8184 16L4.30859 24.7174"
            stroke="#2B86FC"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M27.6916 24.7175L18.1816 16"
            stroke="#2B86FC"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span className="text-[#2B86FC] interFonts text-base font-medium">
          Versand per Email
        </span>
      </div>
      <div
        className="flex items-center mt-2 cursor-pointer"
        onClick={() => handleBriefAction(3)}
      >
        <svg
          className="mr-2"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.5514 23.8416L22.8558 27.8358C23.6617 28.3464 24.6622 27.587 24.4231 26.6463L22.6016 19.481C22.5503 19.2815 22.5564 19.0715 22.6191 18.8752C22.6819 18.6789 22.7987 18.5044 22.9563 18.3715L28.6097 13.6661C29.3525 13.0478 28.9691 11.815 28.0147 11.7531L20.6318 11.2739C20.4329 11.2597 20.2422 11.1893 20.0818 11.0709C19.9214 10.9525 19.7979 10.791 19.7258 10.6051L16.9722 3.67097C16.8974 3.4737 16.7643 3.30387 16.5906 3.18403C16.417 3.06418 16.211 3 16 3C15.789 3 15.583 3.06418 15.4094 3.18403C15.2357 3.30387 15.1026 3.4737 15.0278 3.67097L12.2742 10.6051C12.2021 10.791 12.0786 10.9525 11.9182 11.0709C11.7578 11.1893 11.5671 11.2597 11.3682 11.2739L3.98525 11.7531C3.03087 11.815 2.64746 13.0478 3.3903 13.6661L9.04371 18.3715C9.20126 18.5044 9.31813 18.6789 9.38088 18.8752C9.44362 19.0715 9.4497 19.2815 9.39841 19.481L7.70918 26.126C7.42222 27.2549 8.62287 28.1661 9.58991 27.5534L15.4486 23.8416C15.6134 23.7367 15.8047 23.681 16 23.681C16.1953 23.681 16.3866 23.7367 16.5514 23.8416V23.8416Z"
            stroke="#2B86FC"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span className="text-[#2B86FC] interFonts text-base font-medium">
          Download als PDF & Versand per Email
        </span>
      </div>
    </>
  );
};

export { BriefHeader, Options };
