import React from 'react';
import PropTypes from 'prop-types';
import { Dialog as MuiDialog, DialogTitle, DialogContent, IconButton, Divider } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const Dialog = ({ open, onClose, maxWidth, fullWidth, children, title }) => {
  return (
    <MuiDialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth}>
      <DialogTitle>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            fontSize: 25,
          }}
        >
          <HighlightOffIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {children}
      </DialogContent>
    </MuiDialog>
  );
};

Dialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  maxWidth: PropTypes.string,
  fullWidth: PropTypes.bool,
  children: PropTypes.node,
  title: PropTypes.string,
};

export default Dialog;