export default function fixString(string:String) 
{
    const str = string.toLowerCase();

    const com_acento = "àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";
    const sem_acento = "aaaaaaaceeeeiiiionoooooouuuuybyr";
    var novastr="";

        for(var i=0; i<str.length; i++) {
            var troca = false;
            for (var a=0; a<com_acento.length; a++) {
                if (str.substr(i,1)==com_acento.substr(a,1)) {
                    novastr+=sem_acento.substr(a,1);
                    troca=true;
                    break;
                }
            }
            if (troca==false) {
                novastr+=str.substr(i,1);
            }
        }
        return novastr;
    }