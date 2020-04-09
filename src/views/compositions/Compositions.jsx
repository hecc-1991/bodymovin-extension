import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import CompositionsList from './list/CompositionsList'
import CompositionsListHeader from './listHeader/CompositionsListHeader'
import MainHeader from '../../components/header/Main_header'
import {
	getDestination,
	getLutPath,
	filterChange,
	toggleItem,
	displaySettings,
	getCompositions,
	goToPreview,
	goToPlayer,
	toggleShowSelected,
	applySettingsToSelectedComps,
	toggleCompNameAsDefault,
	goToImportFile,
} from '../../redux/actions/compositionActions'
import { startRender, showRenderBlock } from '../../redux/actions/renderActions'
import compositions_selector from '../../redux/selectors/compositions_selector'
import Variables from '../../helpers/styles/variables'

const styles = StyleSheet.create({
	wrapper: {
		width: '100%',
		height: '100%',
		padding: '10px',
		backgroundColor: '#474747'
	},
	toggleButton: {
		fontSize: '12px',
		color: '#eee',
		textDecoration: 'underline',
		cursor: 'pointer',
		paddingTop: '6px',
		':hover': {
			color: Variables.colors.green,
		}
	}
})

class Compositions extends React.Component {

	constructor() {
		super()
		this.selectDestination = this.selectDestination.bind(this)
		this.selectLutPath = this.selectLutPath.bind(this)
		this.showSettings = this.showSettings.bind(this)
		this.renderComps = this.renderComps.bind(this)
		//this.goToPreview = this.goToPreview.bind(this)
	}

	selectDestination(comp) {
		this.props.getDestination(comp)
	}

	selectLutPath(comp) {
		this.props.getLutPath(comp)
	}

	showSettings(item) {
		this.props.displaySettings(item.id)
	}



	renderComps() {
		if (!this.props.canRender) {
			this.props.showRenderBlock(['There are no Compositions to render.', 'Make sure you have at least one selected and a Destination Path set.'])
		} else {
			this.props.startRender()
			//browserHistory.push('/render')
		}

	}
	/*goToPreview() {
		//browserHistory.push('/preview')
	}*/

	/*goToPlayer() {
		browserHistory.push('/player')
	}*/

	render() {
		return (
			<div className={css(styles.wrapper)}>
				<MainHeader
					canRender={this.props.canRender}
					startRender={this.renderComps}
					goToPreview={this.props.goToPreview}
					refresh={this.props.getCompositions}
					goToImportFile={this.props.goToImportFile}
					goToPlayer={this.props.goToPlayer} />
				<CompositionsListHeader
					filterValue={this.props.filter}
					filterChange={this.props.filterChange}
					shouldUseCompNameAsDefault={this.props.shouldUseCompNameAsDefault}
					onCompNameAsDefaultToggle={this.props.onCompNameAsDefaultToggle}

				/>
				<CompositionsList
					items={this.props.visibleItems}
					selectDestination={this.selectDestination}
					selectLutPath={this.selectLutPath}
					showSettings={this.showSettings}
					toggleItem={this.props.toggleItem} />
				<div
					className={css(styles.toggleButton)}
					onClick={this.props.toggleShowSelected}>
					{this.props.showOnlySelected ? '显示所有合成层' : '显示选中的合成层'}
				</div>
				<div
					className={css(styles.toggleButton)}
					onClick={this.props.applySettingsToSelectedComps}>
					{'将保存的设置应用到所选合成'}
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return compositions_selector(state)
}

const mapDispatchToProps = {
	getDestination: getDestination,
	getLutPath: getLutPath,
	toggleItem: toggleItem,
	displaySettings: displaySettings,
	getCompositions: getCompositions,
	filterChange: filterChange,
	startRender: startRender,
	goToPreview: goToPreview,
	goToPlayer: goToPlayer,
	showRenderBlock: showRenderBlock,
	toggleShowSelected: toggleShowSelected,
	applySettingsToSelectedComps: applySettingsToSelectedComps,
	goToImportFile: goToImportFile,
	onCompNameAsDefaultToggle: toggleCompNameAsDefault,
}

export default connect(mapStateToProps, mapDispatchToProps)(Compositions)
