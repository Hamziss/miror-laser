import { useFrame, useThree } from "@react-three/fiber"

export function PositionDisplay({ position }) {
	return (
		<div
			style={{
				position: "absolute",
				top: "10px",
				left: "10px",
				color: "white",
				backgroundColor: "rgba(0,0,0,0.5)",
				padding: "10px",
				fontFamily: "monospace",
			}}
		>
			Camera Position:
			<br />
			X: {position.x}
			<br />
			Y: {position.y}
			<br />
			Z: {position.z}
		</div>
	)
}
export function CameraPositionLogger({ setPosition }) {
	const { camera } = useThree()

	useFrame(() => {
		setPosition({
			x: camera.position.x.toFixed(2),
			y: camera.position.y.toFixed(2),
			z: camera.position.z.toFixed(2),
		})
	})

	return null
}
