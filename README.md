# Bagoo
A tool for storing your favourite commands and short notes.

## Installation
`npm install bagoo`

## Usage
An item in baggo consists of:
- **name** to identify the item
- **value** for the item
- **description** to help explain what the item is or does
- **catagory** to group related items together

### Available commands
- **add** - an item to your bag
- **get** - retrieve an item
- **list** - lists all available catagories or lists all items within a catagory
- **remove** - an item or all items from your bag
- **copy** - creates a copy of your bag to another location
### Adding an item to baggo
- `--name | -n ` (mandatory)
- `--value | -v` (mandatory)
- `--description | -d` (optional)
- `--catagory | -c` (optional - defaults to "other")

#### example:
```sh
bag add -n="make directory" -v="mkdir" -c="linux commands" -d="Linux command for creating a new directory"
```

### Getting an item from bagoo
- `--name | -n` (mandatory)

Returns all properties for the specified item.

Example
```sh
bag get -n="make directory"
```

Returns
```
catagory: linux commands
description: command for creating a new directory
value: mkdir
```
Optionally specify one of:
- `--value | -v`
- `--catagory | -c`
- `--description | -d`

Will return the the value of the property specified for the item.

Example
```sh
bag get -n="make directory" -v
```
Returns
```sh
mkdir
```

### Listing items
Lists all available catagories within baggo.

Example
```sh
bag list
```
Returns
```
Available catagories:
- linux commands
- favourite animals
- recipes
- something else
```

Specifying a catagory will list all items within that catagory and display the item name and its description

Example
```sh
bag list -c="linux commands"
```

Returns
```
Items recorded under linux commands:
- make directory : Linux command for creating a new directory
- another item : A description of another item... 
```

### Removing an item
You can remove a specific item.
Example 
```sh
bag remove -n="make directory"
```
Returns
```
Removed make directory from your bag
```
Or remove all items by adding the `--purge | -p` flag.

Example
```sh
bag remove -p
```
You will then be prompted.
```
This action will remove all items in your bag, are you sure?: (Y/N): 
```

### Copying your bag to another location
You might wish to copy your bag so you can use it elsewhere.

Example
```sh
bag copy
```
You will then be prompted 
```
Enter the path to where you want to export your bag to:
```
Enter the path of where you want to copy the bag to.
i.e `/home/documents`

You will then be notfied
```
Copying your bag to /home/documents
```

**NOTE**: this command only creates a copy of your bag at the specified location it does not switch the context. (TODO)
