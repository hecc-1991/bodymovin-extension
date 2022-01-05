import React from 'react'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
    unSupportE: {
        borderBottom:'1px solid #FFFFFF',
      },
      unSupportType: {
        width: '30%',
        display: 'inline-block',
        verticalAlign: 'middle',
        textAlign: 'center',
        padding: '5px',
        fontSize: '16px',
        color: '#b71e15',
        background: '#c0c0c0'
    
      },
    
      unSupportContent: {
        width: '70%',
        display: 'inline-block',
        verticalAlign: 'middle',
        textAlign: 'center',
        padding: '5px',
        fontSize: '16px',
        color: '#b71e15',
        background: '#a0a0a0'
      },

      unSupportType2: {
        width: '30%',
        display: 'inline-block',
        verticalAlign: 'middle',
        textAlign: 'center',
        padding: '5px',
        fontSize: '16px',
        color: '#b71e15',
        background: '#0000FF'
    
      },
    
      unSupportContent2: {
        width: '70%',
        display: 'inline-block',
        verticalAlign: 'middle',
        textAlign: 'center',
        padding: '5px',
        fontSize: '16px',
        color: '#b71e15',
        background: '#0000FF'
      },
})


class UnSupportItem extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
            let elem = this.props.elem;
            let showUnSupportElem = this.props.showUnSupportElem;
            let index = this.props.index;
            return <li className={css(styles.unSupportE)} index={index} onClick={(e) => {showUnSupportElem(elem.id);this.setCurrentIndex(e)}}>
              <div>
              <div className={css(styles.unSupportType)}>{elem.type}</div>
              <div className={css(styles.unSupportContent)}>{elem.content}</div>
              </div>
            </li>;
    }
}

export default UnSupportItem