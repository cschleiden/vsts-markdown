import { expect } from "chai";

import * as $ from "jquery";

import { Model, Utils } from "./model";

describe("Utils", () => {
    describe("parse input", () => {
        it("should identify md content", () => {
            let result = Utils.extractMarkdown(`<p style="display:none;" id="md">md**test**</p>  asome&nbsp;<b>html&nbsp;</b>&nbsp;conest<div>asfdl long</div>`);

            expect(result.markdownContent).to.be.eq("md**test**");
            expect(result.htmlContent).to.be.eq("  asome&nbsp;<b>html&nbsp;</b>&nbsp;conest<div>asfdl long</div>");
        });

        it("should identify legacy", () => {
            let result = Utils.extractMarkdown(`<p>test</p>  asome&nbsp;<b>html&nbsp;</b>&nbsp;conest<div>asfdl long</div>`);

            expect(result.markdownContent).to.be.null;
            expect(result.htmlContent).to.be.eq("<p>test</p>  asome&nbsp;<b>html&nbsp;</b>&nbsp;conest<div>asfdl long</div>");
        });
    });

    describe("parse html", () => {
        it("should parse common TFS formatting", () => {
            check(
                `<b>bold</b><div><i>italic</i></div><div><u>underline</u></div><div><b><i>bold-italic</i></b></div><div><b><u>bold-underline</u></b></div><div><u><i>italic-underline</i></u></div>`,
                "**bold**\n_italic_\n<u>underline</u>\n**_bold-italic_**\n**<u>bold-underline</u>**\n<u>_italic-underline_</u>");
        })

        it("should parse spans", () => {
            check(
                `<span style="font-style: italic;">asome </span><b>html </b>&nbsp;con<span style="font-style: italic;">est</span>&nbsp;`,
                "_asome_ **html** con_est_");

        });

        it("should parse images", () => {
            check(
                `<span style="font-style:italic;">test</span><div><img src="https://cs-brazil.visualstudio.com/WorkItemTracking/v1.0/AttachFileHandler.ashx?FileNameGuid=67ab2c59-0aae-47d7-9ef2-a2669ce47f7f&amp;FileName=rejected.png" style="width:437.75px;"></div><div>test2</div>`,
                `_test_\n![](https://cs-brazil.visualstudio.com/WorkItemTracking/v1.0/AttachFileHandler.ashx?FileNameGuid=67ab2c59-0aae-47d7-9ef2-a2669ce47f7f&FileName=rejected.png)\ntest2`);
        });
    });

    describe("roundtrips html", () => {
        it("should roundtrip code", () => {
            let input = "`code`";
            let html = Utils.renderMarkdown(input);
            let markdown = Utils.convertToMarkdown(html);
            expect(markdown).to.eq(input);
            console.log(markdown);
            console.log(html);
        })
    });

    const check = (input, output) => {
        const test = Utils.convertToMarkdown(input);
        expect(test).to.equal(output);
    };
});