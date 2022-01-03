import React from 'react'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
    unSupportType: {
        width: '30%',
        display: 'inline-block',
        verticalAlign: 'middle',
        textAlign: 'center',
        padding: '5px',
        fontSize: '16px',
        color: '#FFFFFF',
        background: 'transparent'
    
      },
    
      unSupportContent: {
        width: '70%',
        display: 'inline-block',
        verticalAlign: 'middle',
        textAlign: 'center',
        padding: '5px',
        fontSize: '16px',
        color: '#FFFFFF',
        background: 'transparent'
      }
})

class UnSupportHeader extends React.Component {

    render() {
        if(this.props.hidden)
            return null;
        
        return <div>
        <div className={css(styles.unSupportType)}>不支持的类型</div>
        <div className={css(styles.unSupportContent)}>详情</div>
        </div>;
    }
}

export default UnSupportHeader