export function SceneLighting() {
  return (
    <>
      <color attach="background" args={['#2f3028']} />
      <ambientLight color="#b99f7a" intensity={0.86} />

      <directionalLight
        color="#fff1de"
        intensity={2.45}
        position={[22, 30, 16]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={140}
        shadow-camera-left={-38}
        shadow-camera-right={38}
        shadow-camera-top={34}
        shadow-camera-bottom={-34}
        shadow-bias={-0.0008}
      />

      <directionalLight color="#e6eef6" intensity={0.36} position={[-18, 14, -10]} />
      <hemisphereLight args={['#ead7b7', '#504634', 0.7]} />

      <spotLight
        color="#f3cf96"
        intensity={0.52}
        angle={0.48}
        penumbra={0.6}
        distance={90}
        position={[10, 18, 24]}
        target-position={[12, 0, 4]}
      />
    </>
  )
}
