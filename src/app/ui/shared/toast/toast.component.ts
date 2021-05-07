import { Component, Input } from "@angular/core";

declare var $: any;
@Component({
  selector: "app-toast",
  templateUrl: "./toast.component.html",
  styleUrls: ["./toast.component.scss"],
})
export class ToastComponent {
  @Input() message: string = "";
  @Input() type: "success" | "info" | "error" = "info";
  @Input() delay = 3000;
  @Input() id = 1;

  show() {
    $(`#toast-${this.id}`).toast("show");

    setTimeout(() => {
      $(`#toast-${this.id}`).toast("hide");
    }, this.delay);
  }
}
