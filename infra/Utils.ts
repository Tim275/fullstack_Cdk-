// Importieren der benötigten Klassen aus der AWS CDK-Bibliothek
import { Fn, Stack } from "aws-cdk-lib";

// Funktion zur Extraktion eines Suffix aus der Stack-ID
export function getSuffixFromStack(stack: Stack){
    // Die Stack-ID wird an den '/'-Zeichen aufgeteilt und das dritte Element (Index 2) wird ausgewählt.
    // Dies ergibt eine kürzere Stack-ID.
    const shortStackId = Fn.select(2, Fn.split('/', stack.stackId));
    
    // Die kurze Stack-ID wird an den '-'-Zeichen aufgeteilt und das fünfte Element (Index 4) wird ausgewählt.
    // Dies ergibt das Suffix der Stack-ID.
    const suffix = Fn.select(4, Fn.split('-', shortStackId));
    
    // Das Suffix wird zurückgegeben.
    return suffix;
}