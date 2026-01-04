var commands = [];

/**
 * Command එකතු කරන ප්‍රධාන function එක
 */
function cmd(info, func) {
    var data = info;
    data.function = func;
    if (!data.dontAddCommandList) data.dontAddCommandList = false;
    if (!info.desc) info.desc = '';
    if (!data.fromMe) data.fromMe = false;
    if (!info.category) data.category = 'misc';
    if (!info.filename) data.filename = "Not Provided";
    commands.push(data);
    return data;
}

// ESM වලදී export කරන ආකාරය
export {
    cmd,
    cmd as AddCommand,
    cmd as Function,
    cmd as Module,
    commands
};
