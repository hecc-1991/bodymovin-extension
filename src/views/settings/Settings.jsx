import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import BaseButton from '../../components/buttons/Base_button'
import SettingsListItem from './list/SettingsListItem'
import SettingsExportMode from './SettingsExportMode'
import SettingsCollapsableItem from './collapsable/SettingsCollapsableItem'
import { setCurrentCompId, cancelSettings, toggleSettingsValue, updateSettingsValue, toggleExtraComp, goToComps, rememberSettings, applySettings } from '../../redux/actions/compositionActions'
import settings_view_selector from '../../redux/selectors/settings_view_selector'
import Variables from '../../helpers/styles/variables'

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    padding: '10px',
    backgroundColor: '#161616'
  },
  container: {
    width: '100%',
    height: '100%',
    fontSize: '12px',
    color: '#eee',
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    width: '100%',
    height: '60px',
    alignItems: 'center',
    display: 'flex',
    flexGrow: 0,
    padding: '10px 0',
    justifyContent: 'space-between'
  },
  headerTitle: {
    flexGrow: 0,
    fontSize: '18px',
  },
  headerButtons: {
    flexGrow: 0,
    display: 'inline-block',
    verticalAlign: 'top',
  },
  headerButtonsButton: {
    backgroundColor: 'transparent',
    borderRadius: '4px',
    color: Variables.colors.green,
    cursor: 'pointer',
    display: 'inline-block',
    marginLeft: '4px',
    padding: '4px 1px',
    textDecoration: 'underline',
    verticalAlign: 'top',
  },
  headerSpacer: {
    width: '100%',
    flexGrow: 0,
    fontSize: '18px',
    padding: '12px 4px'
  },
  compsList: {
    width: '100%',
    flexGrow: 1,
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  bottomNavigation: {
    borderRadius: '4px',
    width: '100%',
    flexGrow: 0,
    height: '40px',
    marginBottom: '20px',
    marginTop: '20px',
    textAlign: 'center'
  },
  bottomNavigationSeparator: {
    width: '10px',
    display: 'inline-block'
  },
  extraCompsWrapper: {
    width: '100%',
    background: Variables.colors.gray_darkest
  },
  extraCompsContainer: {
    padding: '10px 10px 10px 60px',
    display: 'flex',
    flexWrap: 'wrap',
    height: '100%',
    width: '100%',
    background: Variables.gradients.blueGreen
  },
  extraCompsItem: {
    padding: '6px 4px',
    borderRadius: '4px',
    border: '1px solid white',
    color: '#fff',
    marginRight: '4px',
    marginBottom: '4px',
    cursor: 'pointer',
    textAlign: 'center',
    flexGrow: 1,
    textOverflow: 'ellipsis',
    overflow: 'hidden'

  },
  extraCompsItemSelected: {
    backgroundColor: '#fff',
    color: '#333'
  }
})

class Settings extends React.PureComponent {

  constructor() {
    /*demo: false
    extraComps: Object
    active: false
    list: Array
    glyphs: false
    guideds: falsehiddens: falsesegmentTime: 10segmented: falsestandalone: false*/
    super()
    this.storedSettings = null
    this.cancelSettings = this.cancelSettings.bind(this)
    this.toggleGlyphs = this.toggleValue.bind(this, 'glyphs')
    this.toggleGuideds = this.toggleValue.bind(this, 'guideds')
    this.toggleHiddens = this.toggleValue.bind(this, 'hiddens')
    this.toggleOriginalNames = this.toggleValue.bind(this, 'original_names')
    this.toggleOriginalAssets = this.toggleValue.bind(this, 'original_assets')
    this.toggleCompressImages = this.toggleValue.bind(this, 'should_compress')
    this.toggleEncodeImages = this.toggleValue.bind(this, 'should_encode_images')
    this.toggleSkipImages = this.toggleValue.bind(this, 'should_skip_images')
    this.toggleExpressionProperties = this.toggleValue.bind(this, 'ignore_expression_properties')
    this.toggleJsonFormat = this.toggleValue.bind(this, 'export_old_format')
    this.toggleSkipDefaultProperties = this.toggleValue.bind(this, 'skip_default_properties')
    this.toggleNotSupportedProperties = this.toggleValue.bind(this, 'not_supported_properties')
    this.toggleExtraComps = this.toggleValue.bind(this, 'extraComps')
    this.qualityChange = this.qualityChange.bind(this)
  }

  componentDidMount() {
    if (this.props.settings) {
      this.storedSettings = this.props.settings
    } else {
      this.props.setCurrentCompId(this.props.params.id)
    }
  }

  componentWillReceiveProps(props) {
    if (!this.storedSettings && props.settings) {
      this.storedSettings = props.settings
    }
  }

  cancelSettings() {
    this.props.cancelSettings(this.storedSettings)
    //browserHistory.push('/')
  }

  saveSettings() {
    //browserHistory.push('/')
    this.props.goToComps()
  }

  toggleValue(name) {
    this.props.toggleSettingsValue(name)
  }

  qualityChange(ev) {
    let segments = parseInt(ev.target.value, 10)
    if (ev.target.value === '') {
      this.props.updateSettingsValue('compression_rate', 0)
    }
    if (isNaN(segments) || segments < 0) {
      return
    }
    this.props.updateSettingsValue('compression_rate', segments)
  }

  getExtraComps() {
    return this.props.extraCompsList.map(function (item) {
      return (<div
        key={item.id}
        className={css(styles.extraCompsItem, item.selected ? styles.extraCompsItemSelected : '')}
        onClick={() => this.props.toggleExtraComp(item.id)}>
        {item.name}
      </div>)
    }.bind(this))
  }

  render() {

    const isUsingOriginalAssets = this.props.settings.original_assets

    return (
      <div className={css(styles.wrapper)}>
        <div className={css(styles.container)}>
          <div className={css(styles.header)}>
            <div className={css(styles.headerTitle)}>设置</div>
            <div className={css(styles.headerButtons)}>
              <button
                className={css(styles.headerButtonsButton)}
                onClick={this.props.onRememberSettings}
              >
                保存设定
                </button>
              <button
                className={css(styles.headerButtonsButton)}
                onClick={this.props.onApplySettings}
              >
                应用保存的设定
                </button>
            </div>
          </div>
          <ul className={css(styles.compsList)}>
            <SettingsListItem
              title='字体图形化'
              description='将文本转换为路径'
              toggleItem={this.toggleGlyphs}
              active={this.props.settings ? this.props.settings.glyphs : false} />
            <SettingsListItem
              title='导出隐藏图层'
              description='选中则被隐藏的图层也会一起导出'
              toggleItem={this.toggleHiddens}
              active={this.props.settings ? this.props.settings.hiddens : false} />
            <SettingsListItem
              title='导出参考线图层'
              description='选中则参考线图层也会一起导出'
              toggleItem={this.toggleGuideds}
              active={this.props.settings ? this.props.settings.guideds : false} />
            <SettingsListItem
              title='外部合成'
              description='如果合成中有表达式指向另外的合成，将会一起导出'
              toggleItem={this.toggleExtraComps}
              active={this.props.settings ? this.props.settings.extraComps.active : false} />
            {this.props.settings && this.props.settings.extraComps.active &&
              <li className={css(styles.extraCompsWrapper)}>
                <div className={css(styles.extraCompsContainer)}>
                  {this.getExtraComps()}
                </div>
              </li>}
            <SettingsCollapsableItem
              title={'图片资源设置'}
              description={'非矢量图片资源设置（jpg、png)'}
            >
              <SettingsListItem
                title='保留图片名称'
                description='导出图片资源时保留其原始名称'
                toggleItem={this.toggleOriginalNames}
                active={this.props.settings ? this.props.settings.original_names : false} />
              <SettingsListItem
                title='复制原始图片资源'
                description='使用原始的源文件 ( AI 图层不起效果)'
                toggleItem={this.toggleOriginalAssets}
                active={this.props.settings ? this.props.settings.original_assets : false} />
              {this.props.canCompressAssets &&
                !isUsingOriginalAssets &&
                <SettingsListItem
                  title='压缩图片'
                  description='设置图片压缩率（0-100），数值越小体积越小，画质也越差'
                  toggleItem={this.toggleCompressImages}
                  needsInput={true}
                  inputValue={this.props.settings ? this.props.settings.compression_rate : 0}
                  inputValueChange={this.qualityChange}
                  active={this.props.settings ? this.props.settings.should_compress : false} />
              }
              <SettingsListItem
                title='转成base64'
                description='将图片资源转换为base64代码并一起保存到 JSON 文件中'
                toggleItem={this.toggleEncodeImages}
                active={this.props.settings ? this.props.settings.should_encode_images : false} />
              <SettingsListItem
                title='跳过图片资源导出'
                description='如果上次修改没有改动图片素材，可以用这个选项跳过'
                toggleItem={this.toggleSkipImages}
                active={this.props.settings ? this.props.settings.should_skip_images : false} />
            </SettingsCollapsableItem>
            <SettingsExportMode />
            <SettingsCollapsableItem
              title={'高级设置'}
              description={'高级属性'}
            >
              <SettingsListItem
                title='不导出仅用于驱动表达式的属性（以减少 JSON 文件体积）'
                description='导出时不带上仅用于驱动表达式的属性。如果你的动画没有使用表达式，或者你用的表达式不通过表达式所在的属性以外的特定属性来驱动，可以勾上这个选项。'
                toggleItem={this.toggleExpressionProperties}
                active={this.props.settings ? this.props.settings.ignore_expression_properties : false} />
              <SettingsListItem
                title='导出旧版本的 JONS 格式'
                description='如果你在使用旧版本的库，导出旧版本的 JSON 格式以兼容之。'
                toggleItem={this.toggleJsonFormat}
                active={this.props.settings ? this.props.settings.export_old_format : false} />
              <SettingsListItem
                title='不导出默认属性（以减少 JSON 文件体积）'
                description='注意！如果你不是在使用最新版的 安卓、iOS、或者 Web 客户端库，请不要勾选这个选项。'
                toggleItem={this.toggleSkipDefaultProperties}
                active={this.props.settings ? this.props.settings.skip_default_properties : false} />
            </SettingsCollapsableItem>
          </ul>
          <div className={css(styles.bottomNavigation)}>
            <BaseButton text='取消' type='gray' onClick={this.cancelSettings}></BaseButton>
            <div className={css(styles.bottomNavigationSeparator)}></div>
            <BaseButton text='保存' type='green' onClick={this.props.goToComps}></BaseButton>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return settings_view_selector(state)
}

const mapDispatchToProps = {
  setCurrentCompId: setCurrentCompId,
  onRememberSettings: rememberSettings,
  onApplySettings: applySettings,
  cancelSettings: cancelSettings,
  goToComps: goToComps,
  toggleSettingsValue: toggleSettingsValue,
  updateSettingsValue: updateSettingsValue,
  toggleExtraComp: toggleExtraComp,
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
