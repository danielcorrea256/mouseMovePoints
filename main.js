/* CONSTANTS */
let cloth_height      = document.documentElement.clientHeight,
    cloth_width       = document.body.clientWidth,
    spacing           = 50;

let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")

canvas.width = cloth_width;
canvas.height = cloth_height;

let Point = function(x, y) {
    this.x = x
    this.y = y
    this.x0 = x
    this.y0 = y
    this.moving = false
}

Point.prototype.draw = function(color="whitesmoke") {
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.arc(this.x, this.y, 1, 0, 2*Math.PI)
    ctx.stroke();
}

Point.prototype.spaceOut = function({x, y}) {
    if (this.moving) clearInterval(this.animationId)

    let adjacent = Math.abs(x - this.x)
    let opposite = Math.abs(y - this.y)

    let h = Math.sqrt((adjacent*adjacent) + (opposite*opposite))

    let angle = Math.asin(opposite/h)
    let new_length = h * 2

    let delta_x = (Math.cos(angle) * new_length) - adjacent 
    let delta_y = (Math.sin(angle) * new_length) - opposite
    
    if (this.x < x) delta_x *= -1
    if (this.y < y) delta_y *= -1
    
    this.moving = true
    
    let i = 0
    this.animationId = setInterval(() => {
        ctx.clearRect(this.x-5, this.y-5, 10, 10)
        this.x += (delta_x / 10)
        this.y += (delta_y / 10)
        this.draw()
        if (++i == 10) {
            clearInterval(this.animationId)
            this.spaceIn()
        }
    }, 25)
}

Point.prototype.spaceIn = function() {
    delta_x = this.x0 - this.x 
    delta_y = this.y0 - this.y
    console.log("x: "+ this.x + " y: " + this.y + " x0: " + this.x0 + " y0: "+ this.y0 + " delta_x: " + delta_x + " delta_y: " + delta_y)
    let i = 10
    this.animationId = setInterval(() => {
        ctx.clearRect(this.x-5, this.y-5, 10, 10)
        this.x += (this.x0 - this.x) / i
        this.y += (this.y0 - this.y) / i
        this.draw()
        if(--i == 1) {
            clearInterval(this.animationId)
            this.moving = false
        } 
    }, 25)
}

let Cloth = function() {
    this.points = []
    for (let y = 0; y <= cloth_height; y+=spacing) {
        for (let x = 0; x <= cloth_width; x+=spacing) {
            let p = new Point(x, y)
            this.points.push(p)
        }
    }
}

Cloth.prototype.draw = function() {
    ctx.beginPath()

    let i = cloth.points.length
    while (i--) cloth.points[i].draw()
    ctx.stroke()
}

let cloth = new Cloth()
cloth.draw()

window.addEventListener('resize', function() { 
    cloth_height      = document.documentElement.clientHeight
    cloth_width       = document.body.clientWidth
    canvas.width = cloth_width
    canvas.height = cloth_height

    cloth = new Cloth()
    cloth.draw()
})

canvas.onmousemove = function(e) { 
    let affected = cloth.points.filter((({x, y}) => Math.abs(e.x - x) < 60 && Math.abs(e.y - y) < 60))
    affected.forEach(p => {
        p.spaceOut(e)
    })
}