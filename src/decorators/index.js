export function Readonly(target, name, descriptor) {
    descriptor.writable = false;
    return descriptor;
}

export function Configurable(value) {
    return function(target, name, descriptor){
        descriptor.configurable = value;
        return descriptor;
    }
}