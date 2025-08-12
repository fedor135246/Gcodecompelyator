let number=0;
var canger = document.getElementById('changer');
let cange_name=["Ресование графики","Работа с файлом"]
function change(){
    document.querySelector('.set_size').children[number].classList.add('display-none')
    number++
    if(number==2){
        number =0;
    }
    document.querySelector('.set_size').children[number].classList.remove('display-none')
    canger.innerText=cange_name[number];
    if(number==1){
        document.querySelector('.load').children[0].classList.add('display-none')
        document.querySelector('.load').children[1].classList.remove('param_1')
        document.querySelector('.load').children[1].classList.add('param_2')
        document.getElementById('heightsm').classList.add('display-none')
    }
    else{
        document.querySelector('.load').children[0].classList.remove('display-none')
        document.querySelector('.load').children[1].classList.remove('param_2')
        document.querySelector('.load').children[1].classList.add('param_1')
        document.getElementById('heightsm').classList.remove('display-none')
    }
}
document.querySelector('[data-button-change]').addEventListener('click', change);
export {number}