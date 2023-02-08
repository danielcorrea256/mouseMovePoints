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
    this.moving = false
}

Point.prototype.draw = function(color="#494b4d") {
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.arc(this.x, this.y, 1, 0, 2*Math.PI)
    ctx.stroke();
}

Point.prototype.spaceOut = function({x, y}) {
    let adjacent = Math.abs(x - this.x)
    let opposite = Math.abs(y - this.y)

    let h = Math.sqrt((adjacent*adjacent) + (opposite*opposite))

    let angle = Math.asin(adjacent/h)
    let new_length = h*1.5

    let delta_x = (Math.cos(angle) * new_length) - adjacent 
    let delta_y = (Math.sin(angle) * new_length) - opposite

    if (this.x < x) delta_x *= -1
    if (this.y < y) delta_y *= -1

    this.animationId = setInterval(() => {
        ctx.clearRect(this.x-5, this.y-5, 10, 10)
        this.x += (delta_x / 200)
        this.y += (delta_y / 200)
        this.draw()
    }, 10)
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
    let affected = cloth.points.filter((({x, y, moving}) => Math.abs(e.x - x) < 60 && Math.abs(e.y - y) < 60 && !moving))

    affected.forEach(p => {
        ctx.clearRect(p.x-5,p.y-5, 10, 10)
        let xBefore = p.x
        let yBefore = p.y
        p.moving = true
        p.spaceOut(e)
        //p.draw()

        setTimeout(() => {
            clearInterval(p.animationId)
            ctx.clearRect(p.x-5,p.y-5, 15, 15)
            p.x = xBefore
            p.y = yBefore
            p.moving = false
            p.draw()
        }, 2000)
    })
}