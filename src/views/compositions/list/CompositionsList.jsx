import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import CompositionsListItem from './CompositionsListItem'

const styles = StyleSheet.create({
  list: {
    height: 'calc( 100% - 180px)',
    overflow: 'auto'
  }
})

class CompositionsList extends React.PureComponent {

  createItem(item) {
    return <CompositionsListItem
      item={item}
      toggleItem={this.props.toggleItem}
      showSettings={this.props.showSettings}
      selectDestination={this.props.selectDestination}
      selectLutPath={this.props.selectLutPath}
      key={item.id} />
  }

  render() {

    let items = this.props.items.map((item) => {
      return this.createItem(item)
    })

    return (
      <ul className={css(styles.list)} >
        {items}
      </ul>
    );
  }
}

export default CompositionsList