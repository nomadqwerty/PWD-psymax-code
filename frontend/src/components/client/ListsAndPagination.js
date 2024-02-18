import { Grid, TablePagination } from '@mui/material';
import Button from '../common/Button';

const ClientList = ({
  clientList,
  selectedClient,
  removeSelected,
  addSelected,
  router,
  formatDate,
  setModelOption,
  setOpen,
  setDeleteData,
  setActionTitle,
  setConfirmTxt,
}) => {
  let clients = clientList?.map((Klient, index) => {
    const checkExist = selectedClient.includes(Klient?._id);
    return (
      <div
        className="flex items-center w-full border-[1px] border-[#D6D8DC] radius4"
        key={`1${index}`}
      >
        <div
          className="text-[#707070]  font-normal leading-[26px] text-base xs:w-[20%] sm:w-[10%] md:w-[15%] lg:w-[10%] xl:w-[7%] cursor-pointer"
          onClick={() =>
            checkExist
              ? removeSelected(Klient?._id, 1)
              : addSelected(Klient?._id, 1)
          }
        >
          <svg
            className="m-4"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="24"
              height="24"
              rx="3"
              fill={`${checkExist ? '#2B86FC' : '#EEEEEE'}`}
            />
            {checkExist && (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.5614 8.97526L12.0774 16.1753C11.8509 16.4696 11.5008 16.6424 11.1294 16.6433C10.7601 16.6452 10.4104 16.477 10.1814 16.1873L7.25341 12.4553C6.98974 12.1166 6.9268 11.6629 7.08828 11.2653C7.24976 10.8676 7.61114 10.5863 8.03628 10.5273C8.46142 10.4683 8.88574 10.6406 9.14941 10.9793L11.1054 13.4753L15.6414 7.47526C15.9029 7.13228 16.3276 6.95488 16.7553 7.00987C17.1831 7.06487 17.5491 7.3439 17.7153 7.74187C17.8816 8.13984 17.8229 8.59628 17.5614 8.93926V8.97526Z"
                fill="white"
              />
            )}
          </svg>
        </div>
        <div
          className="text-[#2B86FC] font-normal text-base leading-[26px] xs:w-[60%] sm:w-[20%] md:w-[30%] lg:w-[25%] xl:w-[18%] cursor-pointer"
          onClick={() => router.push(`/dashboard/klientinnen/${Klient?._id}`)}
        >
          {Klient?.Chiffre}
        </div>
        <div className="text-[#707070] font-normal leading-[26px] text-base xs:w-[50%] sm:w-[30%] md:w-[30%] lg:w-[25%] xl:w-[20%]">
          {formatDate(Klient?.createdAt)}
        </div>
        <div className="xs:w-[50%] sm:w-[50%] md:w-[30%] lg:w-[40%] xl:w-[50%] xs:text-left sm:text-left md:text-left lg:text-right">
          <Button
            size="xm"
            varient="primary"
            className="radius4 xs:mr-1 sm:mr-5 xs:my-2 md:mb-1 sm:mb-0"
            onClick={() => router.push(`/dashboard/klientinnen/${Klient?._id}`)}
          >
            Bearbeiten
          </Button>
          <Button
            size="xm"
            varient="destructive"
            className="radius4 xs:my-2 md:mb-1 sm:mb-0"
            onClick={() => {
              setModelOption('Entfernen');
              setOpen(true);
              setDeleteData({
                isActive: 1,
                index: index,
                id: Klient?._id,
              });
              setActionTitle('Aktion überprüfen');
              setConfirmTxt(
                'Bitte überprüfen Sie Ihre Aktion. Die von Ihnen beabsichtigte Aktion kann nicht rückgängig gemacht werden.'
              );
            }}
          >
            Entfernen
          </Button>
        </div>
      </div>
    );
  });
  return clients;
};

const Pagination = ({ pageObj, fetchClient }) => {
  return (
    <Grid container sx={{ alignItems: 'center' }}>
      <Grid item xs={12}>
        <TablePagination
          component="div"
          count={pageObj?.total}
          page={pageObj?.pagenum - 1}
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
            fetchClient(newPage + 1);
          }}
        />
      </Grid>
    </Grid>
  );
};

export { ClientList, Pagination };
