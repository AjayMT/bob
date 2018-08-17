
# bob

bob is an [akinator](http://akinator.com) inspired binary tree navigator.

## Usage

    node bob/index.js [data-file]

`data-file` is a JSON file that contains binary tree data. Defaults to `bob/data.json`

bob asks questions contained in `data-file` until it reaches an endpoint.

    $ node bob/index.js
    Is your character alive? (y/n) y
    Is your character real? (y/n)
    ...
    Is your character the founder of PayPal? (y/n) y
    Elon Musk
    Correct? (y/n) y

If bob does not reach a single endpoint, or if it is incorrect, bob will prompt the user to append to the dataset.

    ...
    Is your character the founder of PayPal? (y/n) y
    Elon Musk
    Correct? (y/n) n
    Name: Peter Thiel
    Question (optional):
    Answer (y/n):

    ...
    Is your character the founder of PayPal? (y/n) y
    ERROR Peter Thiel, Elon Musk are identical
    Question: Is your character the founder of Tesla?
    Answer for Peter Thiel (y/n): n

    ...
    Is your character the founder of PayPal? (y/n) n
    ERROR none found
    Name: Jeff Bezos
    Question (optional):
    Answer (y/n):

If the name or question entered already exist in the dataset, bob will overwrite existing data.

## `data-file` format

The format in which binary tree data is stored is as follows.

```json
{
  "Is your character the founder of PayPal?": {
    "Elon Musk": true,
    "Peter Thiel": true,
    "Jeff Bezos": false
  },
  "Is your character the founder of Tesla?": {
    "Elon Musk": true,
    "Peter Thiel": false,
    "Jeff Bezos": false
  }
}
```

bob will always ask the question that eliminates the largest number of names, i.e the question for which the ratio of 'yes' to 'no' responses is closest to 1:1. This allows bob to find the shortest reasonable route to each endpoint most of the time, and is only possible when the binary tree data is stored in the 'flat' representation depicted above and not in the form of an actual binary tree.
