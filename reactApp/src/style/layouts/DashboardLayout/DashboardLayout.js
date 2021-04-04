import React, { Component} from 'react';
import { withStyles } from '@material-ui/core';
import NavBar from './NavBar';
import TopBar from './TopBar';
import Footer from './Footer';
import PropTypes from 'prop-types'

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    }
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

class DashboardLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchNodes: "",
      isMobileNavOpen: false
    }
  }

  render () {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <TopBar onMobileNavOpen={() => this.setState( {isMobileNavOpen: true} )} />
        <NavBar
          onMobileClose={() => this.setState( {isMobileNavOpen: false} )}
          openMobile={this.state.isMobileNavOpen}
        />
        <div className={classes.wrapper}>
          <div className={classes.contentContainer}>
            <div className={classes.content}>
              {this.props.children}
              <Footer />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

DashboardLayout.propTypes= {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DashboardLayout);
