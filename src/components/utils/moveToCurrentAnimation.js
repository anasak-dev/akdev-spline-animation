// on radio change move to selected animation
const moveToCurrentAnimation = (splineAnimations, splineProps, id) => {
	// ScrollTrigger.refresh();
	splineAnimations?.siw?.map((siwItem) => {
		{
			return siwItem?.animations?.map((animation, i) => {
				// if (animation.id == id) {
				if (i < id + 1) {
					const {
						animation: {
							animationProperies: { position, rotation, scale },
						},
					} = animation;

					const obj = splineProps.current.findObjectByName(
						animation.animation.objectLayer,
					);
					const moveAnimation = gsap.timeline({ ease: "none", paused: true });
					position &&
						moveAnimation.to(
							obj?.position,
							{
								x:
									!isNaN(parseInt(position.x)) == true
										? position.x
										: obj?.position.x,
								y:
									!isNaN(parseInt(position.y)) == true
										? position.y
										: obj?.position.y,
								z:
									!isNaN(parseInt(position.z)) == true
										? position.z
										: obj?.position.z,
								ease: "none",
							},
							"<",
						);

					rotation &&
						moveAnimation.to(
							obj?.rotation,
							{
								x:
									!isNaN(parseInt(rotation.x)) == true
										? rotation.x
										: obj?.rotation.x,
								y:
									!isNaN(parseInt(rotation.y)) == true
										? rotation.y
										: obj?.rotation.y,
								z:
									!isNaN(parseInt(rotation.z)) == true
										? rotation.z
										: obj?.rotation.z,
								ease: "none",
								onComplete: () => {},
							},
							"<",
						);
					scale &&
						moveAnimation.to(
							obj?.scale,
							{
								x: !isNaN(parseInt(scale.x)) == true ? scale.x : obj?.scale.x,
								y: !isNaN(parseInt(scale.y)) == true ? scale.y : obj?.scale.y,
								z: !isNaN(parseInt(scale.z)) == true ? scale.z : obj?.scale.z,
								ease: "none",
							},

							"<",
						);
					gsap.to(moveAnimation, { ease: "none", progress: 1 });
				}
			});
		}
	});
};
// on radio change move to selected animation

export default moveToCurrentAnimation;
