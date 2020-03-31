import { Component, ViewChild, OnInit } from "@angular/core";
import { MatInput } from "@angular/material";
import { FieldType } from "@ngx-formly/material";

/**
 * Repeating section
 */
@Component({
  selector: "autosize-text",
  template: `
    <textarea
      matInput
      cdkTextareaAutosize
      [id]="id"
      [formControl]="formControl"
      #autosize="cdkTextareaAutosize"
      [cols]="to.cols"
      [rows]="to.rows"
      [placeholder]="to.placeholder"
      [formlyAttributes]="field"
      [matTextareaAutosize]="true"
    ></textarea>
  `
})
export class AutosizeTextComponent extends FieldType implements OnInit {
  /** Basic constructor */

  constructor() {
    super();
  }
  @ViewChild(MatInput, { static: true }) formFieldControl: MatInput;
  ngOnInit() {}
}

export const textAreaAutoResizeType = {
  name: "textarea-auto-resize",
  component: AutosizeTextComponent,
  wrappers: ["form-field"]
};
