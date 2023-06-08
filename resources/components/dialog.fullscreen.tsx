import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { render } from 'react-dom';

type PropsDialogFullscreen = {
    isOpen : boolean
    handleClose : () => void
    title : string
    textSave? : string
    children : JSX.Element
    renderButton? : JSX.Element
    handleSave? : () => void
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogFullScreen({ isOpen , handleClose ,title,textSave = "" , handleSave = (() => null) , renderButton , children } : PropsDialogFullscreen) {

  return (
    <Dialog
        open={isOpen}
        fullScreen
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }} elevation={0} variant='outlined' color='transparent'>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <Close />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {title}
            </Typography>
            {
                renderButton ||
                <Button variant="outlined" color="inherit" type="submit" onClick={handleSave}>
                    { textSave || "Guardar" }
                </Button>
            }
          </Toolbar>
        </AppBar>
        {children}
    </Dialog>
  )
}
