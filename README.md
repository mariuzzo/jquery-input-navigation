jQuery Input Navigation
=======================

Retro-like navigation trough HTML input fields using arrow keys.

**This project is currently under development, to show off your interest star this project**

Want to contribute?
-------------------

We use the "forking with feature branches" workflow, to start follow these simple instructions. If you're not familiar with this workflow read this well written article ["Our git workflow – Forks with feature branches" ](http://x-team.com/2013/09/our-git-workflow-forks-with-feature-branches/) by [Kamil Ogórek](https://github.com/kamilogorek).

 1. Fork this repository.
 2. Create a new branch from develop, then code.
 3. Finally, create a pull request to be reviewed then merged.

What to contribute?
-------------------

Ladies and gentleman, I introduce you the **list of features to be implemented for the first release**:

 - **Navigate through input fields using the arrow keys.**
    - Create the logic to make the `key-down` for moving forward to the next input field, and the `key-up` for moving back.
    - Create a boolean option named `cyclic` that will indicates if the navigation trough input fields will be cyclic (being in the last input field and moving to next will navigate to the first one). Example of use: `InputNavigation('form').config({ cyclic: true })`. The default value will false.
    
 - **Manual navigation through input fields using methods.**
 	- Create a method for allowing manual navigation to the next input field. That method should be called as follow: `InputNavigation('form').next()`.
    - Create a method for allowing manual navigation to the previous input field. That method should be called as follow: `InputNavigation('form').prev()`.

 - **Create the data-API support.**
    - To activate the input navigation in any DOM node use the attribute: `data-input-navigation`.
    - To set options: `data-input-navigation="{ cyclic: true }"`.
