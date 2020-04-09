import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import BaseButton from '../../components/buttons/Base_button'
import Bodymovin from '../../components/bodymovin/bodymovin'
import anim from '../../assets/animations/bm.json'
import { openInBrowser, getPlayer } from '../../helpers/CompositionsProvider'
import Variables from '../../helpers/styles/variables'
import { goToComps } from '../../redux/actions/compositionActions'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 30px',
    backgroundColor: '#474747'
  },
  back_container: {
    textAlign: 'right'
  },
  anim_container: {
    textAlign: 'center'
  },
  bm_container: {
    width: '80px',
    height: '80px',
    display: 'inline-block'
  },
  text_container: {
    paddingBottom: '15px',
    textAlign: 'center'
  },
  text_title: {
    color: Variables.colors.white,
    fontFamily: 'Roboto-Black',
    paddingBottom: '25px',
    fontSize: '14px'
  },
  text_par: {
    color: '#fff',
    fontSize: '10px',
    lineHeight: '14px'
  },
  link: {
    color: Variables.colors.green
  },
  buttons_container: {
    textAlign: 'center'
  },
  buttonSeparator: {
    width: '10px',
    display: 'inline-block'
  }
})

class Player extends React.Component {

  openInBrowser() {
    openInBrowser('https://github.com/airbnb/lottie-web')
  }

  getPlayer() {
    getPlayer(false)
  }

  getPlayerZipped() {
    getPlayer(true)
  }

  render() {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.back_container)}>
          <BaseButton text={'‹ 返回'} onClick={this.props.goToComps} type="gray" />
        </div>
        <div className={css(styles.anim_container)}>
          <Bodymovin animationData={anim} autoplay={true} loop={true}>
            <div className={css(styles.bm_container)}></div>
          </Bodymovin>
        </div>
        <div className={css(styles.text_container)}>
          <div className={css(styles.text_title)}>模板导出工具-涂图定制版</div>
          <div className={css(styles.text_par)}>
            <p>这个插件将After Effects动画导出为web兼容格式。</p>
            <p>为了在您的浏览器上播放导出的动画，请遵循以下说明
                <a className={css(styles.link)} href='#' onClick={this.openInBrowser}> Lottie on github</a>
            </p>
            <br />
            <p>您可以从存储库获取播放器的最新版本，也可以复制扩展中包含的播放器。</p>
          </div>
        </div>
        <div className={css(styles.buttons_container)}>
          <BaseButton text={'获取播放器'} type='green' onClick={this.getPlayer} />
          <div className={css(styles.buttonSeparator)}></div>
          <BaseButton text={'获取播放器 压缩版本'} type='green' onClick={this.getPlayerZipped} />
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = {
  goToComps: goToComps
}

export default connect(null, mapDispatchToProps)(Player)
