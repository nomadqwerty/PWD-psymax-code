import { Box, Modal } from '@mui/material';
import Button from '../common/Button';

const ModelDialogue = ({
  open,
  setOpen,
  actionTitle,
  confirmationText,
  agreeModel,
  closeModel,
  className,
  children,
  cancelHide = false,
  submitHide = false,
}) => {
  const modelStyle = {
    p: 7,
    position: 'absolute',
    /* top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '98%',
    height: '98%', */
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: 'background.paper',
    // borderRadius: '4px',
    // boxShadow: '4px 4px 10px 0px rgba(17, 17, 17, 0.25)',
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal keepMounted open={open} onClose={() => handleClose()}>
      <Box
        sx={modelStyle}
        className={className !== '' ? className : `model-box`}
      >
        <div className="interFonts text-[#3C3C3C] text-4xl font-bold pb-10">
          {actionTitle}
        </div>
        <div className="interFonts text-[#707070] text-base font-normal">
          {confirmationText}
        </div>
        {children}
        <div className="pt-6">
          {!cancelHide && (
            <Button
              type="button"
              varient="primary"
              className="radius4 bg-[#FBD6D8] text-[#E30C40] hover:bg-[#E30C40] hover:text-[#fff] mr-5 py-2 px-5"
              onClick={() => closeModel()}
            >
              Abbrechen
            </Button>
          )}
          {!submitHide && (
            <Button
              type="submit"
              varient="primary"
              className="radius4 py-2 px-5"
              onClick={() => agreeModel()}
            >
              Bestätigen
            </Button>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default ModelDialogue;
