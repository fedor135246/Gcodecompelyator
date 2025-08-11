let i=0;
function change(){
    console.log(i)
    document.querySelector('.set_size').children[i].classList.add('display-none')
    i++
    if(i==2){
        i =0;
    }
    document.querySelector('.set_size').children[i].classList.remove('display-none')
    console.log(i)
}
export {change}