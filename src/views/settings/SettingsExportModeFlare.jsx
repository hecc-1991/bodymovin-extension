import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import SettingsListItem from './list/SettingsListItem'
import {
  handleModeToggle,
} from '../../redux/actions/compositionActions'
import settings_selector from '../../redux/selectors/settings_rive_selector'

const styles = StyleSheet.create({
  wrapper: {
    width: '100%'
  },
  wrapperActive: {
    border: '1px solid #666',
  },
  compsList: {
    width: '100%',
    flexGrow: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '0 0 0 10px',
  },
})

class SettingsExportModeStandard extends React.PureComponent {

  handleModeToggle = () => {
    this.props.handleModeToggle('Rive模式');
  }

  render() {
    return (
      <div className={css(styles.wrapper, this.props._isActive && styles.wrapperActive)}>
        <ul>
          <SettingsListItem
            title='Rive'
            description='导出动画，作为一个Rive项目'
            toggleItem={this.handleModeToggle}
            active={this.props._isActive} />
        </ul>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return settings_selector(state)
}

const mapDispatchToProps = {
  handleModeToggle: handleModeToggle,
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsExportModeStandard)