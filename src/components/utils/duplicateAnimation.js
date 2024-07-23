const duplicateAnimation = (
	id,
	animationId,
	splineAnimations,
	attributes,
	setAttributes,
) => {
	// Function to add a new JSON object to the animations array
	const animationToDuplicate = splineAnimations.siw.map((siwItem) => {
		{
			return siwItem.animations.map((animation) => {
				if (animation.id === animationId) {
					return animation;
				}
			});
		}
	});
	const animationDupFlatten = animationToDuplicate.flat();
	const animationDupFiltered = animationDupFlatten.filter((item) => item);

	// Function to add a new JSON object to the animations array
	const newSiwAnimations = attributes.splineAnimations.siw.map((siwItem) => {
		// Check if the siwItem has the same id as the one you want to update
		if (siwItem.id === id) {
			// Add the new JSON object to the animations array
			return {
				...siwItem,
				animations: [
					...siwItem.animations,
					{
						animeName: animationDupFiltered[0].animeName,
						type: "normal",
						id: Math.random() * 10 + 1 + splineAnimations.siw.length + 1,
						animation: {
							...animationDupFiltered[0].animation,
						},
						animeBoundaries: "",
					},
				],
			};
		}
		return siwItem;
	});

	setAttributes({
		splineAnimations: {
			siw: newSiwAnimations,
		},
	});
};

export default duplicateAnimation;
