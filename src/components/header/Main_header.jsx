import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import BaseButton from '../buttons/Base_button'
import BodymovinRefresh from '../bodymovin/bodymovin_refresh'
import Variables from '../../helpers/styles/variables'

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: '10px'
    },
    right: {
        marginRight: '7px',
    },
    buttons_container: {
        width: '100%',
        height: '50px',
        display: 'flex',
        alignItems: 'center'
    },
    button: {
        marginRight: '7px',
        flex: '0 0 auto',
    },
    buttons_separator: {
        flex: '1 1 auto',
    },
    refresh: {
        width: '40px',
        height: '31px',
        backgroundColor: 'transparent',
        verticalAlign: 'middle',
        cursor: 'pointer',
        transition: 'transform 500ms ease-out',
        webkitFilter: 'saturate(100%)'
    },
    refresh_image: {
        maxWidth: '100%',
        maxHeight: '100%'
    },
    separator: {
        width: '100%',
        height: '1px',
        backgroundColor: Variables.colors.gray2,
        marginTop: '20px',
        marginBottom: '20px'
    }
})

function Main_header(props) {
    return (<div className={css(styles.container)}>
        <div className={css(styles.buttons_container)}>
            <div className={css(styles.button, styles.refresh)} onClick={props.refresh}>
                <BodymovinRefresh />
            </div>
            <BaseButton text='渲染动画' type='green' classes={styles.button} disabled={!props.canRender} onClick={props.startRender} />
            {/* <BaseButton text='检查模板' type='gray' classes={styles.button} onClick={props.goToPreview} /> */}
            <div className={css(styles.buttons_separator)}></div>
            {/* <BaseButton text='导入动画' type='gray' classes={styles.right} onClick={props.goToImportFile} />
            <BaseButton text='获取播放器' type='gray' classes={styles.right} onClick={props.goToPlayer} /> */}
        </div>
        <div className={css(styles.separator)}></div>
    </div>)
}

export default Main_header