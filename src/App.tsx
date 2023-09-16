import { useEffect, useState } from 'react'
import * as C from './App.styles'
import logoImage from './assets/devmemory_logo.png'
import restartIcon from './svgs/restart.svg'
import { Button } from './components/button'
import { InfoItem } from './components/infoItem'
import { GridItemType } from './types/GridItemType'
import { GridItem } from './components/GridItem'
import { items } from './data/items'
import { formatTimeElapsed } from './helpers/formatTimeElapsed'

const App = () => {
	const [playng, setPlayng] = useState<boolean>(false)
	const [timeElapsed, setTimeElapsed] = useState<number>(0)
	const [movieCount, setMovieCount] = useState<number>(0)
	const [showCount, setShowCount] = useState<number>(0)
	const [gridItems, setGridItems] = useState<GridItemType[]>([])

	useEffect(() => {
		resetAndCreateGrid()
	}, [])

	useEffect(() => {
		const timer = setInterval(() => {
			if (playng) {
				setTimeElapsed(timeElapsed + 1)
			}
		}, 1000)
		return () => clearInterval(timer)
	}, [playng, timeElapsed])

	useEffect(() => {
		if (showCount === 2) {
			let opened = gridItems.filter(item => item.shown === true)
			if (opened.length === 2) {
				if (opened[0].item === opened[1].item) {
					let tempGrid = [...gridItems]
					for(let i in tempGrid) {
						if (tempGrid[i].shown) {
							tempGrid[i].permanentShown = true
							tempGrid[i].shown = false
						}
					}
					setGridItems(tempGrid)
					setShowCount(0)
				} else {
					setTimeout(() => {
						let tempGrid = [...gridItems]
						for(let i in tempGrid) {
							tempGrid[i].shown = false
						}
						setGridItems(tempGrid)
						setShowCount(0)
					}, 1000)
				}
				
				setMovieCount(movieCount => movieCount + 1)
			}
		}
	}, [showCount, gridItems])

	useEffect(() => {
		if (movieCount > 0 && gridItems.every(item => item.permanentShown === true)) {
			setPlayng(false)
		}
	}, [movieCount, gridItems])

	const resetAndCreateGrid = () => {
		setTimeElapsed(0)
		setMovieCount(0)
		setShowCount(0)

		let tempGrid: GridItemType[] = []

		for(let i = 0; i < (items.length * 2); i++) {
			tempGrid.push({
				item: null,
				shown: false,
				permanentShown: false
			})
		}

		for(let w = 0; w < 2; w++) {
			for(let i = 0; i < (items.length); i++) {
				let pos = -1
				while(pos < 0 || tempGrid[pos].item !== null) {
					pos = Math.floor(Math.random() * (items.length * 2))
				}
				tempGrid[pos].item = i
			}
		}

		setGridItems(tempGrid)

		setPlayng(true)
	}

	const handleItemClick = (index: number) => {
		if (playng && index !== null && showCount < 2) {
			let tempGrid = [...gridItems]
			if (tempGrid[index].permanentShown === false && tempGrid[index].shown === false) {
				tempGrid[index].shown = true
				setShowCount(showCount + 1)
			}
			setGridItems(tempGrid)
		}
	}

	return (
		<div>
			<C.Container>
				<C.Info>
					<C.LogoLink>
						<img src={logoImage} width="200" alt="" />
					</C.LogoLink>
					<C.InfoArea>
						<InfoItem label='Tempo' value={formatTimeElapsed(timeElapsed)} />
						<InfoItem label='Movimentos' value={movieCount.toString()} />
					</C.InfoArea>
					<Button label='Reiniciar' icon={restartIcon} onClick={resetAndCreateGrid} />
				</C.Info>
				<C.GridArea>
					<C.Grid>
						{gridItems.map((item, index) => (
							<GridItem key={index} item={item} onClick={() => handleItemClick(index)} />
						))}
					</C.Grid>
				</C.GridArea>
			</C.Container>
		</div>
	)
}

export default App