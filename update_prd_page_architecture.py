import pathlib
import zipfile
import xml.etree.ElementTree as ET

SRC = pathlib.Path("松鼠仓库-产品施工指南-PRD-带目录.docx")
if not SRC.exists():
    SRC = [
        p
        for p in pathlib.Path(".").glob("*PRD*目录.docx")
        if "backup" not in p.name and "page-architecture-update" not in p.name
    ][0]

DST = pathlib.Path("squirrel-warehouse-prd-page-architecture-update.docx")
NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
ET.register_namespace("w", NS["w"])

INDEX_REPLACEMENTS = {
    98: "AI 自动生成的分类位置，用于摆放松果。果架分区与复盘文档章节保持一致，常态在右侧折叠，需要查看时再展开。",
    122: "• AI 生成果架、果签和复盘文档，并保持果架分区与复盘文档章节一致。",
    123: "• 复盘文档展示、右侧折叠松果架和底部工具栏。",
    138: "• 停留在唯一产品页中，右侧内容区切换为该松果仓的复盘文档。初始为空时展示空状态和添加松果入口。",
    151: "• 文档由大标题、小标题、简短说明和重点条目组成。",
    152: "• 点击右侧“松果架”可展开查看与章节一致的松果分区。",
    161: "对应松果架分区",
    165: "对应松果架分区",
    171: "• 复盘文档章节必须与松果架分区一一对应，便于查看该章节下的松果。",
    240: "• 能完成分类、标签、文档生成，并保持章节与果架分区一致。",
    246: "• 复盘文档更新：根据松果与果架生成可读文档，并保持章节与果架分区一致。",
    260: "- 每个复盘文档章节必须对应一个果架分区",
    273: "- 精选松果必须保留在对应果架分区或复盘文档重点中",
    316: "• 复盘文档章节必须能对应到存在的果架分区。",
    317: "• 松果架不得展示不存在或已删除的松果。",
    322: "唯一产品页",
    324: "- 左侧松果仓列表与新建松果仓",
    325: "当前选中松果仓内容展示区",
    329: "- 右侧折叠松果架",
    331: "- 底部工具栏",
    343: "• P0：唯一产品页、松果仓列表、复盘文档展示、折叠松果架、底部工具栏。",
    344: "• P1：松果架展开查看、添加松果、整理弹窗、松果编辑删除、精选松果。",
    347: "11.1 唯一产品页",
    354: "11.2 当前松果仓内容区",
    356: "[搜索文档] [松果架]，底部工具栏：[重新整理] [编辑文档] [添加松果]",
    360: "右侧折叠区域：",
    361: "- 松果架，分区与复盘文档章节一致",
    362: "- 常态隐藏，需要时展开",
    385: "• 复盘文档成功生成，并且章节与松果架分区一致。",
    386: "• 点击松果架能展开查看当前章节分区下的松果。",
    392: "• 每个复盘文档章节都有对应松果架分区。",
    393: "• 精选松果在对应松果架分区或复盘文档重点中明显保留。",
    405: "• 实现唯一产品页：左侧松果仓列表，右侧当前松果仓内容区。",
    408: "• 接入模型，生成果架、果签和复盘文档，并保持章节与果架一致。",
    409: "• 展示复盘文档、折叠松果架和底部工具栏。",
}

ARCHITECTURE_NOTE = (
    "产品只有一个页面：左侧为松果仓列表，右侧为当前选中松果仓的内容展示区；"
    "内容区主区域为复盘文档，右侧为常态折叠的松果架，页面下方为重新整理、"
    "编辑文档、添加松果等工具栏。"
)


def paragraph_text(paragraph):
    return "".join((t.text or "") for t in paragraph.findall(".//w:t", NS)).strip()


def set_paragraph_text(text_nodes, value):
    text_nodes[0].text = value
    for node in text_nodes[1:]:
        node.text = ""


with zipfile.ZipFile(SRC, "r") as zin:
    root = ET.fromstring(zin.read("word/document.xml"))

nonempty = []
for paragraph in root.findall(".//w:p", NS):
    text_nodes = paragraph.findall(".//w:t", NS)
    if text_nodes and paragraph_text(paragraph):
        nonempty.append((paragraph, text_nodes))

for index, replacement in INDEX_REPLACEMENTS.items():
    _, text_nodes = nonempty[index]
    set_paragraph_text(text_nodes, replacement)

body = root.find("w:body", NS)
paragraph_elements = body.findall("w:p", NS)
target_paragraph = nonempty[320][0]
target_index = paragraph_elements.index(target_paragraph)
new_paragraph = ET.fromstring(ET.tostring(target_paragraph))
for text_node in new_paragraph.findall(".//w:t", NS):
    text_node.text = ""
new_paragraph.find(".//w:t", NS).text = ARCHITECTURE_NOTE
body.insert(target_index + 1, new_paragraph)

new_xml = ET.tostring(root, encoding="utf-8", xml_declaration=True)
with zipfile.ZipFile(SRC, "r") as zin, zipfile.ZipFile(DST, "w", zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data = zin.read(item.filename)
        if item.filename == "word/document.xml":
            data = new_xml
        zout.writestr(item, data)

print(DST)
print(len(INDEX_REPLACEMENTS) + 1)
