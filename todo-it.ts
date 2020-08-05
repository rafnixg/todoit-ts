import { v4 as uuidv4 } from "uuid";

// Models

class TodoItem {
  private readonly _creationTimestamp: number;
  private readonly _identifier: string;

  constructor(private _description: string, identifier?: string) {
    this._creationTimestamp = new Date().getTime();

    if (identifier) {
      this._identifier = identifier;
    } else {
      // this is just for the example; for any real project, use
      // UUIDs instead: https://www.npmjs.com/package/uuid
      this._identifier = uuidv4();
    }
  }

  get creationTimestamp(): number {
    return this._creationTimestamp;
  }

  get identifier(): string {
    return this._identifier;
  }

  get description(): string {
    return this._description;
  }
}

class TodoList {
  private _todoList: ReadonlyArray<TodoItem> = [];

  constructor(todoList?: TodoItem[]) {
    if (Array.isArray(todoList) && todoList.length) {
      this._todoList = this._todoList.concat(todoList);
    }
  }

  get todoList(): ReadonlyArray<TodoItem> {
    return this._todoList;
  }

  addTodo(todoItem: TodoItem) {
    if (todoItem) {
      this._todoList = this._todoList.concat(todoItem);
    }
  }

  removeTodo(itemId: string) {
    if (itemId) {
      this._todoList = this._todoList.filter((item) => {
        if (item.identifier === itemId) {
          return false; // drop
        } else {
          return true; // keep
        }
      });
    }
  }
}

// Views

interface TodoListView {
  render(todoList: ReadonlyArray<TodoItem>): void;
  getInput(): TodoItem;
  getFilter(): string;
  clearInput(): void;
  filter(): void;
}

class HTMLTodoListView implements TodoListView {
  private readonly todoInput: HTMLInputElement;
  private readonly todoListDiv: HTMLDivElement;
  private readonly todoListFilter: HTMLInputElement;

  constructor() {
    this.todoInput = document.getElementById("todoInput") as HTMLInputElement;
    this.todoListDiv = document.getElementById(
      "todoListContainer"
    ) as HTMLDivElement;
    this.todoListFilter = document.getElementById(
      "todoFilter"
    ) as HTMLInputElement;

    // defensive checks
    if (!this.todoInput) {
      throw new Error(
        "Could not find the todoInput HTML input element. Is the HTML correct?"
      );
    }

    if (!this.todoListDiv) {
      throw new Error(
        "Could not find the todoListContainer HTML div. Is the HTML correct?"
      );
    }

    if (!this.todoListFilter) {
      throw new Error(
        "Could not find the todoFilter HTML input element. Is the HTML correct?"
      );
    }
  }

  clearInput(): void {
    this.todoInput.value = "";
  }

  getFilter(): string {
    return this.todoListFilter.value.toUpperCase();
  }

  getInput(): TodoItem {
    const todoInputValue: string = this.todoInput.value.trim();
    const retVal: TodoItem = new TodoItem(todoInputValue);
    return retVal;
  }

  render(todoList: ReadonlyArray<TodoItem>): void {
    console.log("Updating the rendered todo list");
    this.todoListDiv.innerHTML = "";
    this.todoListDiv.textContent = ""; // Edge, ...

    const ul = document.createElement("ul");
    ul.setAttribute("id", "todoList");
    this.todoListDiv.appendChild(ul);

    todoList.forEach((item) => {
      const li = document.createElement("li");
      li.setAttribute("class", "todo-list-item");
      li.innerHTML = `
      <div class="form-check">
      <label class="form-check-label">
        <input class="checkbox" type="checkbox" /> ${item.description}.
        <i class="input-helper"></i></label>
    </div>
    <a class="remove"href='#' onclick='todoIt.removeTodo("${item.identifier}")'>X</a>`;
      ul.appendChild(li);
    });
  }

  filter(): void {
    console.log("Filtering the rendered todo list");
    const todoListHtml: HTMLUListElement = document.getElementById(
      "todoList"
    ) as HTMLUListElement;
    if (todoListHtml == null) {
      console.log("Nothing to filter");
      return;
    }

    const todoListFilterText = this.getFilter();
    todoListHtml.childNodes.forEach((item) => {
      let itemText: string | null = item.textContent;
      if (itemText !== null) {
        itemText = itemText.toUpperCase();

        if (itemText.startsWith(todoListFilterText)) {
          (item as HTMLLIElement).style.display = "list-item";
        } else {
          (item as HTMLLIElement).style.display = "none";
        }
      }
    });
  }
}
