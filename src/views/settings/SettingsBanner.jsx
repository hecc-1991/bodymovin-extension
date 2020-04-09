import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import {
  handleBannerWidthChange,
  handleBannerHeightChange,
  handleBannerVersionChange,
  handleBannerOriginChange,
  handleBannerLibraryPathChange,
  handleModeToggle,
  lottieBannerRendererUpdated,
  lottieBannerClickTagUpdated,
  lottieBannerZipFilesUpdated,
  lottieBannerCustomSizeFlagUpdated,
  lottieIncludeDataInTemplateUpdated,
  lottieHandleLoopToggleChange,
  lottieHandleLoopCountChange,
} from '../../redux/actions/compositionActions'
import settings_banner_selector from '../../redux/selectors/settings_banner_selector'
import SettingsListItem from './list/SettingsListItem'
import SettingsListInput from './list/SettingsListInput'
import SettingsListDropdown from './list/SettingsListDropdown'
import LottieVersions from '../../helpers/LottieVersions'
import LottieLibraryOrigins from '../../helpers/LottieLibraryOrigins'

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
    padding: '10px 10px',
    backgroundColor: '#111',
  },
})

class SettingsBanner extends React.PureComponent {

  handleLottieOriginChange = (value) => {
    this.props.handleBannerOriginChange(value)
  }

  handleLottieVersionChange = (value) => {
    this.props.handleBannerVersionChange(value)
  }

  handleBannerWidthChange = (ev) => {
    this.props.handleBannerWidthChange(ev.target.value)
  }

  handleBannerHeightChange = (ev) => {
    this.props.handleBannerHeightChange(ev.target.value)
  }

  handleLoopCountChange = (ev) => {
    this.props.handleLoopCountChange(ev.target.value)
  }

  buildLottieOptions = () => {
    return LottieVersions.map(version => ({
      value: version.value,
      text: `${version.name} (${version.fileSize})`,
    }))
  }

  getSelectedLottieVersion() {
    return LottieVersions.find(version => version.value === this.props.lottie_library)
  }

  handleModeToggle = () => {
    this.props.handleModeToggle('banner');
  }

  buildRendererOptions = () => {

    let availableRenderers = ['svg', 'canvas', 'html']
    if (this.props.lottie_origin !== LottieLibraryOrigins.CUSTOM) {
      availableRenderers = this.getSelectedLottieVersion().renderers
    }

    const rendererOptions = [
      {
        value: 'svg',
        text: 'svg'
      },
      {
        value: 'canvas',
        text: 'canvas'
      },
      {
        value: 'html',
        text: 'html'
      }
    ]

    return rendererOptions.filter(renderer => {
      return availableRenderers.includes(renderer.value)
    })
  }

  render() {
    return (
      <div className={css(styles.wrapper, this.props._isActive ? styles.wrapperActive : '')}>
        <ul>
          <SettingsListItem
            title='横幅模式'
            description='导出用于横幅使用的文件包'
            toggleItem={this.handleModeToggle}
            active={this.props._isActive}
          />
        </ul>
        {this.props._isActive &&
          <ul className={css(styles.compsList)}>
            <SettingsListDropdown
              title='Lottie库来源'
              description='库加载方式'
              onChange={this.handleLottieOriginChange}
              current={this.props.lottie_origin}
              options={[
                { value: LottieLibraryOrigins.LOCAL, text: '本地' },
                { value: LottieLibraryOrigins.CDNJS, text: '网络' },
                { value: LottieLibraryOrigins.CUSTOM, text: '自定义' }
              ]}
            />
            {this.props.lottie_origin === LottieLibraryOrigins.CUSTOM &&
              <SettingsListInput
                title='设置lottie库位置'
                description='设置lottie库路径'
                value={this.props.lottie_path}
                onChange={this.props.handleBannerLibraryPathChange}
              />
            }
            {this.props.lottie_origin !== LottieLibraryOrigins.CUSTOM &&
              <SettingsListDropdown
                title='Lottie库版本'
                description='选择库版本类型'
                onChange={this.handleLottieVersionChange}
                current={this.props.lottie_library}
                options={this.buildLottieOptions()}
              />
            }
            <SettingsListDropdown
              title='Lottie渲染器'
              description='选择使用的渲染器'
              onChange={this.props.lottieBannerRendererUpdated}
              current={this.props.lottie_renderer}
              options={this.buildRendererOptions()}
            />
            <SettingsListInput
              title='设置点击标签值'
              description='设置点击标签值'
              value={this.props.click_tag}
              onChange={this.props.handleBannerLibraryClickTagChange}
            />
            <SettingsListItem
              title='使用合成尺寸'
              description='不检查设置自定义横幅宽度和高度'
              toggleItem={this.props.handleCustomSizeFlagChange}
              active={this.props.use_original_sizes} />
            {!this.props.use_original_sizes &&
              <span>
                <SettingsListItem
                  title='宽'
                  description='横幅宽'
                  active={true}
                  needsInput={true}
                  inputValue={this.props.width}
                  inputValueChange={this.handleBannerWidthChange}
                />
                <SettingsListItem
                  title='高'
                  description='横幅高'
                  active={true}
                  needsInput={true}
                  inputValue={this.props.height}
                  inputValueChange={this.handleBannerHeightChange}
                />
              </span>
            }
            <SettingsListItem
              title='Zip 文件'
              description='将横幅文件打包'
              toggleItem={this.props.handleZipFilesChange}
              active={this.props.zip_files} />
            <SettingsListItem
              title='动画数据嵌入模板中'
              description='json数据成为模板的一部分'
              toggleItem={this.props.handleIncludeDataInTemplateChange}
              active={this.props.shouldIncludeAnimationDataInTemplate} />
            <SettingsListItem
              title='循环'
              description='动画将循环播放'
              toggleItem={this.props.handleLoopToggleChange}
              active={this.props.shouldLoop} />
            {!this.props.shouldLoop &&

              <SettingsListItem
                title='循环次数'
                description='设置循环次数'
                active={true}
                needsInput={true}
                inputValue={this.props.loopCount}
                inputValueChange={this.handleLoopCountChange}
              />

            }
          </ul>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return settings_banner_selector(state)
}

const mapDispatchToProps = {
  handleBannerWidthChange: handleBannerWidthChange,
  handleBannerHeightChange: handleBannerHeightChange,
  handleBannerVersionChange: handleBannerVersionChange,
  handleBannerOriginChange: handleBannerOriginChange,
  handleBannerLibraryPathChange: handleBannerLibraryPathChange,
  handleModeToggle: handleModeToggle,
  lottieBannerRendererUpdated: lottieBannerRendererUpdated,
  handleBannerLibraryClickTagChange: lottieBannerClickTagUpdated,
  handleCustomSizeFlagChange: lottieBannerCustomSizeFlagUpdated,
  handleZipFilesChange: lottieBannerZipFilesUpdated,
  handleIncludeDataInTemplateChange: lottieIncludeDataInTemplateUpdated,
  handleLoopToggleChange: lottieHandleLoopToggleChange,
  handleLoopCountChange: lottieHandleLoopCountChange,
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsBanner)