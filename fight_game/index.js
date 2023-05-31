const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576


c.fillRect(0, 0, canvas.width, canvas.height)


const gravity = 0.7

const background = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imgSrc: './img/background_layer_1.png'
})

const fire = new Sprite({
	position: {
		x: 50,
		y: 430
	},
	imgSrc: './img/fire.png',
	scale: 0.5,
	framesMax: 7.5,
})

const fire2 = new Sprite({
	position: {
		x: 926,
		y: 430
	},
	imgSrc: './img/fire2.png',
	scale: 0.5,
	framesMax: 7.5,
})

const player = new Fighter({
	position: {
	x: 400,
	y: 100
	},
	velocity:{
		x: 0,
		y: 0
	},
	offset: {
		x: 0,
		y: 0
	},

	imgSrc: './img/MartHero/Idle.png',
	framesMax: 8,
	scale: 2.5,
	offset: {
		x: 215,
		y: 155
	},
	sprites: {
		idle: {
			imgSrc: './img/MartHero/Idle.png',
			framesMax: 8
		},

		run: {
			imgSrc: './img/MartHero/Run1.png',
			framesMax: 8
		},

		jump: {
			imgSrc: './img/MartHero/Jump.png',
			framesMax: 2
		},

		fall: {
			imgSrc: './img/MartHero/Fall.png',
			framesMax: 2 
		},

		attack1: {
			imgSrc: './img/MartHero/Attack12.png',
			framesMax: 12,
			},
		takeHit: {
			imgSrc: './img/MartHero/Take Hit.png',
			framesMax: 4
		},
			death: {
			imgSrc: './img/MartHero/Death.png',
			framesMax: 6 
		},
	},

	attackBox: {
		offset: {
			x: -130,
			y: 50,
		},
		width: 140,
		height: 50
	}
})





const enemy = new Fighter({
	position: {
	x: 575,
	y: 100
	},
	velocity:{
		x: 0,
		y: 0
	},

	color: 'blue',

	offset: {
		x: 50,
		y: 0
	},
	imgSrc: './img/Evil/Idle.png',
	framesMax: 8,
	scale: 2.4,
	offset: {
		x: 250,
		y: 250
	},

	sprites: {
		idle: {
			imgSrc: './img/Evil/Idle.png',
			framesMax: 8
		},

		run: {
			imgSrc: './img/Evil/Run.png',
			framesMax: 8
		},

		jump: {
			imgSrc: './img/Evil/Jump.png',
			framesMax: 2
		},

		fall: {
			imgSrc: './img/Evil/Fall.png',
			framesMax: 2 
		},

		attack1: {
			imgSrc: './img/Evil/Attack16.png',
			framesMax: 16 
		},
		takeHit: {
			imgSrc: './img/Evil/Takehit.png',
			framesMax: 3
		},
		death: {
			imgSrc: './img/Evil/Death.png',
			framesMax: 7
		}
	},

	attackBox: {
		offset: {
			x: 200,
			y: 50
		},
		width: 140,
		height: 50
	}
})



console.log(player);


const keys = {
	KeyA: {
		pressed : false
	},
	KeyD: {
		pressed : false
	},
	KeyW: {
		pressed : false
	},

	ArrowRight: {
		pressed: false
	},
	ArrowLeft: {
		pressed: false
	},
	ArrowUp: {
		pressed: false
	},
}

decreaseTimer()

function animate() {
	window.requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)
	background.update()
	fire.update()
	fire2.update()
	c.fillStyle = 'rgba(255, 255, 255, 0.01)'
	c.fillRect(0, 0, canvas.width, canvas.height)
	player.update()
	enemy.update()


	player.velocity.x = 0
	enemy.velocity.x = 0

	//player movment

	if (keys.KeyA.pressed && player.lastKey === 'KeyA') {
		player.velocity.x = -5
		player.switchSprite('run')
	} else if (keys.KeyD.pressed && player.lastKey ==='KeyD') {
		player.velocity.x = 5
		player.switchSprite('run')
	} else {
			player.switchSprite('idle')
		}

	//jump
	if(player.velocity.y < 0) {
		player.switchSprite('jump')
	} else if (player.velocity.y > 0) {
		player.switchSprite('fall')
	}



	//enemy movment

	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -5
		enemy.switchSprite('run')
	} else if (keys.ArrowRight.pressed && enemy.lastKey ==='ArrowRight') {
		enemy.velocity.x = 5
		enemy.switchSprite('run')
	} else {
			enemy.switchSprite('idle')
		}

	//jump
	if(enemy.velocity.y < 0) {
		enemy.switchSprite('jump')
	} else if (enemy.velocity.y > 0) {
		enemy.switchSprite('fall')
	}


	//detect for collision & enemy gets hit
	if (
		rectangularCollision({
			rectangle1: player,
			rectangle2: enemy

		}) &&
		 player.isAttacking &&
		 player.framesCurrent === 4

		) {
		enemy.takeHit()
		player.isAttacking = false

		gsap.to('#enemyHealth', {
			width: enemy.health +'%'
		})
	}

	//player misses
	if (player.isAttacking && player.framesCurrent === 4) {
		player.isAttacking = false
	}

	if (
		rectangularCollision({
			rectangle1: enemy,
			rectangle2: player

		}) &&
		 enemy.isAttacking && enemy.framesCurrent === 4

		) {
		player.takeHit()
		enemy.isAttacking = false

		 gsap.to('#playerHealth', {
			width: player.health +'%'
		})
	}

	//enemy misses
	if (enemy.isAttacking && enemy.framesCurrent ===4) {
		enemy.isAttacking = false
	}


	// end the game by health

	if (enemy.health <= 0 || player.health <= 0) {
		determineWinner({player, enemy, timerId})
	}
}

animate()



window.addEventListener('keydown', (event)=> {
    if(!player.dead) {


	switch(event.code) {
		case 'KeyD':
			keys.KeyD.pressed = true
			player.lastKey = 'KeyD'
			break
		case 'KeyA':
			keys.KeyA.pressed = true
			player.lastKey = 'KeyA'
			break
		case 'KeyW':
			player.velocity.y = -20
			break
		case 'Space':
			player.attack()
			break
	}
   }
    
    if(!enemy.dead) {


	switch(event.key) {
		case 'ArrowRight':
			keys.ArrowRight.pressed = true
			enemy.lastKey = 'ArrowRight'
			break
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = true
			enemy.lastKey = 'ArrowLeft'
			break
		case 'ArrowUp':
			enemy.velocity.y = -20
			break
		case 'ArrowDown':
			enemy.attack()
			break
	}
   }
})


window.addEventListener('keyup', (event)=> {
	//player keys
	switch (event.code) {
		case 'KeyD':
			keys.KeyD.pressed = false
			break
		case 'KeyA':
			keys.KeyA.pressed = false
			break


	}

	//enemy keys
	switch (event.key) {
		case 'ArrowRight':
			keys.ArrowRight.pressed = false
			break
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false
			break

	}
})