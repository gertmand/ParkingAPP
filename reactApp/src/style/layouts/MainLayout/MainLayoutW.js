import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import TopBar from './TopBar';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  }
});

class MainLayoutW extends Component {
  render () {
    const { classes } = this.props; 
    return (
      <div className={classes.root}>
        <TopBar />
        <div className={classes.wrapper}>
          <div className={classes.contentContainer}>
            <div className={classes.content}>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(MainLayoutW);
