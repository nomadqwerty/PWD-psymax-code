import { Grid, TablePagination } from '@mui/material';
import Button from '../common/Button';

const InvoiceList = ({
  leistungenAbrechnung,
  router,
  setOpen,
  setDeleteData,
}) => {
  return (
    <div className="flex flex-col gap-[24px] mt-8">
      {leistungenAbrechnung?.map((leistungen, index) => {
        return (
          <div
            key={index}
            className="flex items-baseline w-full border-[1px] p-[16px] border-[#D6D8DC] radius4"
          >
            <div
              className="text-[#2B86FC] font-normal text-base leading-[26px] xs:w-[60%] sm:w-[20%] md:w-[30%] lg:w-[25%] xl:w-[18%] cursor-pointer"
              onClick={() =>
                router.push(
                  `/dashboard/leistungen/abrechnung/${leistungen?._id}`
                )
              }
            >
              {leistungen?.Leistung}
            </div>

            <div className="text-[#707070] font-normal text-base leading-[26px] xs:w-[60%] sm:w-[20%] md:w-[30%] lg:w-[25%] xl:w-[18%] cursor-pointer">
              {leistungen?.GopNr}
            </div>

            <div className="text-[#707070] font-normal text-base leading-[26px] xs:w-[60%] sm:w-[20%] md:w-[30%] lg:w-[25%] xl:w-[18%] cursor-pointer">
              {leistungen?.Betrag}
            </div>

            <div className="xs:w-[50%] sm:w-[50%] md:w-[30%] lg:w-[40%] xl:w-[50%] xs:text-left sm:text-left md:text-left lg:text-right">
              <Button
                size="xm"
                varient="primary"
                className="radius4 xs:mr-1 sm:mr-5 xs:my-2 md:mb-1 sm:mb-0"
                onClick={() =>
                  router.push(
                    `/dashboard/leistungen/abrechnung/${leistungen?._id}`
                  )
                }
              >
                Bearbeiten
              </Button>
              <Button
                size="xm"
                varient="destructive"
                className="radius4 xs:my-2 md:mb-1 sm:mb-0"
                onClick={() => {
                  setOpen(true);
                  setDeleteData({
                    id: leistungen?._id,
                    flag: 1,
                  });
                }}
              >
                Entfernen
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Pagination = ({ pageOptions, pageChangeHandler }) => {
  return (
    <Grid container sx={{ alignItems: 'center' }}>
      <Grid item xs={12}>
        <TablePagination
          component="div"
          count={pageOptions?.total}
          page={pageOptions?.pagenum - 1}
          rowsPerPage={Number(process.env.NEXT_PUBLIC_PAGINATION_LIMIT)}
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
          onPageChange={(_, newPage) => {
            pageChangeHandler(newPage + 1);
          }}
        />
      </Grid>
    </Grid>
  );
};

const ScheduleList = ({
  leistungenTerminplanung,
  router,
  setOpen,
  setDeleteData,
}) => {
  return (
    <div className="flex flex-col gap-[24px] mt-8">
      {leistungenTerminplanung?.map((leistungen, index) => {
        return (
          <div
            key={index}
            className="flex items-baseline w-full border-[1px] p-[16px] border-[#D6D8DC] radius4"
          >
            <div
              className="text-[#2B86FC] font-normal text-base leading-[26px] xs:w-[50%] sm:w-[50%] md:w-[70%] lg:w-[60%] xl:w-[50%] cursor-pointer"
              onClick={() =>
                router.push(
                  `/dashboard/leistungen/terminplanung/${leistungen?._id}`
                )
              }
            >
              {leistungen?.Leistung}
            </div>

            <div className="xs:w-[50%] sm:w-[50%] md:w-[30%] lg:w-[40%] xl:w-[50%] xs:text-left sm:text-left md:text-left lg:text-right">
              <Button
                size="xm"
                varient="primary"
                className="radius4 xs:mr-1 sm:mr-5 xs:my-2 md:mb-1 sm:mb-0"
                onClick={() =>
                  router.push(
                    `/dashboard/leistungen/terminplanung/${leistungen?._id}`
                  )
                }
              >
                Bearbeiten
              </Button>
              <Button
                size="xm"
                varient="destructive"
                className="radius4 xs:my-2 md:mb-1 sm:mb-0"
                onClick={() => {
                  setOpen(true);
                  setDeleteData({
                    id: leistungen?._id,
                    flag: 2,
                  });
                }}
              >
                Entfernen
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export { InvoiceList, Pagination, ScheduleList };
