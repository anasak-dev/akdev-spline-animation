import moveToCurrentAnimation from "./moveToCurrentAnimation";
const playCurrent = (
	splineAnimations,
	splineContainer,
	splineProps,
	editorWrapper,
	previewAnimation,
	setCurrentAnimationItem,
) => {
	document
		.querySelector("body")
		.classList.toggle("active-spline-animation-preview");

	// fetch styles set to spline container
	const splineContainerStyles = splineContainer.current.getAttribute("style");
	// set above styles to edit mode wrapper of splineContainer
	splineContainer.current
		.closest(".block-editor-block-list__block.wp-block")
		.setAttribute("style", splineContainerStyles);
	let bikeRotate;
	splineAnimations.siw.forEach((siwItem) => {
		siwItem.animations &&
			siwItem.animations
				.sort((a, b) => {
					if (a.animation.objectLayer < b.animation.objectLayer) {
						return -1;
					}
					if (a.animation.objectLayer > b.animation.objectLayer) {
						return 1;
					}
					return 0;
				})
				.forEach((animation, index) => {
					if (siwItem.animations[index + 1]) {
						const {
							animation: {
								animationProperies: { position, rotation, scale },
							},
						} = siwItem.animations[index + 1];

						const obj = splineProps?.current?.findObjectByName(
							animation.animation.objectLayer,
						);
						const currentStart = siwItem.animations[index].animeName;
						const nextAnimation = siwItem.animations[index + 1];

						const endValue = nextAnimation.animeName;
						bikeRotate = gsap.timeline({
							defaults: {},
							// paused: true,
							scrollTrigger: {
								// id: "previewAnimeTrigger",
								// defaults: { ease: "power1.inOut" },
								trigger: siwItem.target,
								// invalidateOnRefresh: true,
								scroller: editorWrapper,
								scrub: true,
								start: `${
									currentStart + `% ${siwItem.start ? siwItem.start : "bottom"}`
								}`,
								end: `${
									siwItem.start == "bottom"
										? endValue + "% bottom"
										: endValue + "%"
								}`,

								onRefresh: (e) => {},
								onComplete: () => {},
							},
						});

						if (previewAnimation == false) {
							gsap.globalTimeline.getChildren().forEach((tl) => {
								tl.pause(0).kill();
							});
						} else if (previewAnimation == true) {
							setCurrentAnimationItem(0);
							moveToCurrentAnimation(splineAnimations, splineProps, 0);
							position &&
								siwItem.animations[index + 1].animation.objectLayer ==
									animation.animation.objectLayer &&
								Object.values(position).some((value) => value !== "") &&
								bikeRotate.to(
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
									},
									"<",
								);
							rotation &&
								siwItem.animations[index + 1].animation.objectLayer ==
									animation.animation.objectLayer &&
								Object.values(rotation).some((value) => value !== "") &&
								bikeRotate.to(
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
										onComplete: () => {},
									},
									"<",
								);
							scale &&
								siwItem.animations[index + 1].animation.objectLayer ==
									animation.animation.objectLayer &&
								Object.values(scale).some((value) => value !== "") &&
								bikeRotate.to(
									obj?.scale,
									{
										x:
											!isNaN(parseInt(scale.x)) == true
												? scale.x
												: obj?.scale.x,
										y:
											!isNaN(parseInt(scale.y)) == true
												? scale.y
												: obj?.scale.y,
										z:
											!isNaN(parseInt(scale.z)) == true
												? scale.z
												: obj?.scale.z,
									},

									"<",
								);
						}
					}
				});
	});
};

export default playCurrent;
