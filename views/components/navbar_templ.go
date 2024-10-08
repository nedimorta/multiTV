// Code generated by templ - DO NOT EDIT.

// templ: version: v0.2.778
package components

//lint:file-ignore SA4006 This context is only used if a nested component is present.

import "github.com/a-h/templ"
import templruntime "github.com/a-h/templ/runtime"

func Navbar() templ.Component {
	return templruntime.GeneratedTemplate(func(templ_7745c5c3_Input templruntime.GeneratedComponentInput) (templ_7745c5c3_Err error) {
		templ_7745c5c3_W, ctx := templ_7745c5c3_Input.Writer, templ_7745c5c3_Input.Context
		if templ_7745c5c3_CtxErr := ctx.Err(); templ_7745c5c3_CtxErr != nil {
			return templ_7745c5c3_CtxErr
		}
		templ_7745c5c3_Buffer, templ_7745c5c3_IsBuffer := templruntime.GetBuffer(templ_7745c5c3_W)
		if !templ_7745c5c3_IsBuffer {
			defer func() {
				templ_7745c5c3_BufErr := templruntime.ReleaseBuffer(templ_7745c5c3_Buffer)
				if templ_7745c5c3_Err == nil {
					templ_7745c5c3_Err = templ_7745c5c3_BufErr
				}
			}()
		}
		ctx = templ.InitializeContext(ctx)
		templ_7745c5c3_Var1 := templ.GetChildren(ctx)
		if templ_7745c5c3_Var1 == nil {
			templ_7745c5c3_Var1 = templ.NopComponent
		}
		ctx = templ.ClearChildren(ctx)
		_, templ_7745c5c3_Err = templ_7745c5c3_Buffer.WriteString("<nav class=\"navbar navbar-expand-lg navbar-dark bg-dark\"><div class=\"container-fluid\"><a class=\"navbar-brand\" href=\"#\">Multi-TV</a> <button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#navbarNav\" aria-controls=\"navbarNav\" aria-expanded=\"false\" aria-label=\"Toggle navigation\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse\" id=\"navbarNav\"><ul class=\"navbar-nav ms-auto\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#\" onclick=\"saveConfiguration(event)\">Save</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#\" onclick=\"loadConfiguration(event)\">Load</a></li><li class=\"nav-item dropdown\"><a class=\"nav-link dropdown-toggle\" href=\"#\" id=\"gridViewDropdown\" role=\"button\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\">Grid View</a><ul class=\"dropdown-menu dropdown-menu-end\" aria-labelledby=\"gridViewDropdown\"><li><a class=\"dropdown-item\" href=\"#\" onclick=\"setGridView(1, 2)\">1x2</a></li><li><a class=\"dropdown-item\" href=\"#\" onclick=\"setGridView(2, 2)\">2x2</a></li><li><a class=\"dropdown-item\" href=\"#\" onclick=\"setGridView(3, 2)\">2x3</a></li><li><a class=\"dropdown-item\" href=\"#\" onclick=\"setGridView(3, 3)\">3x3</a></li><li><a class=\"dropdown-item\" href=\"#\" onclick=\"setGridView(4, 3)\">4x3</a></li><li><a class=\"dropdown-item\" href=\"#\" onclick=\"setGridView(4, 4)\">4x4</a></li></ul></li></ul></div></div></nav>")
		if templ_7745c5c3_Err != nil {
			return templ_7745c5c3_Err
		}
		return templ_7745c5c3_Err
	})
}

var _ = templruntime.GeneratedTemplate
