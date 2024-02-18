import { Grid, TablePagination } from '@mui/material';
import Button from '../common/Button';

const JustificationList = ({
  justificationDetails,
  page,
  handleEdit,
  inputRefs,
  handleChange,
  handleBlur,
  setOpen,
  setDeleteData,
}) => {
  return (
    <div className="flex flex-col gap-[24px]">
      {justificationDetails?.map((justification, index) => {
        const pagenumFinal = page?.pagenum > 0 ? page?.pagenum : 1;
        return (
          <div
            key={index}
            className="flex items-baseline w-full border-[1px] p-[16px] border-[#D6D8DC] radius4"
          >
            <span className="text-[#3C3C3C] font-normal text-base leading-[26px] xs:w-[20%] sm:w-[20%] md:w-[20%] lg:w-[15%] xl:w-[10%]">
              #{' '}
              {(
                index +
                1 +
                Number(process.env.NEXT_PUBLIC_PAGINATION_LIMIT) *
                  (pagenumFinal - 1)
              )
                .toString()
                .padStart(3, '0')}
            </span>
            {!justification.edit ? (
              <div className="flex items-center  interFonts text-[#707070] font-normal leading-[26px] text-base xs:w-[70%] sm:w-[70%] md:w-[70%] lg:w-[75%] xl:w-[80%]">
                <span className="pr-2">{justification.begruendungstexte}</span>
                <svg
                  className="editBtn"
                  onClick={() => handleEdit(index)}
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.25 11.8124H2.625C2.50897 11.8124 2.39769 11.7663 2.31564 11.6843C2.23359 11.6022 2.1875 11.491 2.1875 11.3749V8.93115C2.1875 8.8737 2.19882 8.81681 2.2208 8.76373C2.24279 8.71065 2.27502 8.66242 2.31564 8.62179L8.87814 2.05929C8.96019 1.97725 9.07147 1.93115 9.1875 1.93115C9.30353 1.93115 9.41481 1.97725 9.49686 2.05929L11.9406 4.50307C12.0227 4.58512 12.0688 4.6964 12.0688 4.81243C12.0688 4.92847 12.0227 5.03975 11.9406 5.12179L5.25 11.8124Z"
                    stroke="#2B86FC"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.4375 3.5L10.5 6.5625"
                    stroke="#2B86FC"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.8125 11.8125H5.25L2.21533 8.77783"
                    stroke="#2B86FC"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ) : (
              <input
                ref={(input) =>
                  (inputRefs[`begruendungstexte${index}`] = input)
                }
                name="begruendungstexte"
                type="text"
                id="begruendungstexte"
                className="interFonts text-[#707070] font-normal leading-[26px] text-base xs:w-[70%] sm:w-[70%] md:w-[70%] lg:w-[75%] xl:w-[80%]"
                value={justification?.begruendungstexte}
                onChange={(e) => handleChange(e, index)}
                onBlur={() => handleBlur(index)}
                style={{ outline: 'none' }}
              />
            )}
            <Button
              size="xm"
              varient="destructive"
              className="radius4"
              onClick={() => {
                setOpen(true);
                setDeleteData(index);
              }}
            >
              Entfernen
            </Button>
          </div>
        );
      })}
    </div>
  );
};

const Pagination = ({ page, setJustificationData }) => {
  let pageProp;
  if (page.pagenum > 0) {
    pageProp = page.pagenum - 1;
  } else {
    pageProp = 0;
  }
  return (
    <Grid item xs={6} sm={6} md={8} lg={10}>
      <TablePagination
        component="div"
        count={page?.total}
        page={pageProp}
        rowsPerPage={Number(process.env.NEXT_PUBLIC_PAGINATION_LIMIT) || 10}
        labelRowsPerPage=""
        sx={{
          '& .MuiTablePagination-input': {
            marginRight: '5px !important',
            display: 'none',
          },
          '& .MuiTablePagination-actions': {
            marginLeft: '5px !important',
          },
          '& .MuiTablePagination-toolbar': {
            justifyContent: 'center',
            paddingLeft: '0px',
            paddingRight: '0px',
          },
          '@media (min-width: 600px)': {
            '& .MuiTablePagination-toolbar': {
              justifyContent: 'flex-end',
            },
          },
        }}
        onPageChange={(_, newPage) => setJustificationData(newPage + 1)}
      />
    </Grid>
  );
};

export { JustificationList, Pagination };
