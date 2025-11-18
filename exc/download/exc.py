import os
import zipfile
import sys
import json
import shutil
from pathlib import Path

class exc():
    # 应用安装目录
    INSTALL_DIR = Path.home() / '.exc'
    
    class json():
        @staticmethod
        def read(path):
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            if globals().get('debug'):
                print(f"[DEBUG] 读取 JSON: {path}")
            return data
        
        @staticmethod
        def write(path, data):
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=4)
            if globals().get('debug'):
                print(f"[DEBUG] 写入 JSON: {path}")

    @staticmethod
    def _get_app_name(exc_file):
        """提取应用名称"""
        filename = Path(exc_file).name
        if filename.endswith('.exc'):
            return filename[:-4]
        return filename

    @staticmethod
    def clean(extract_path):
        try:
            if globals().get('debug'):
                print(f"[DEBUG] 清理目录: {extract_path}")
            shutil.rmtree(os.path.abspath(extract_path))
        except Exception as e:
            if globals().get('debug'):
                print(f"[DEBUG] 清理失败: {e}")

    @staticmethod
    def install(exc_file):
        """安装 EXC 应用"""
        try:
            if not os.path.isfile(exc_file):
                raise FileNotFoundError(f"文件不存在: {exc_file}")
            
            app_name = exc._get_app_name(exc_file)
            install_path = exc.INSTALL_DIR / app_name
            
            if install_path.exists():
                response = input(f"应用 '{app_name}' 已存在，覆盖？ (y/N): ")
                if response.lower() != 'y':
                    return
            
            if globals().get('debug'):
                print(f"[DEBUG] 安装到: {install_path}")
            
            install_path.mkdir(parents=True, exist_ok=True)
            
            with zipfile.ZipFile(exc_file, 'r') as zip_file:
                zip_file.extractall(install_path)
            
            start_script = install_path / "start.sh"
            if start_script.exists():
                start_script.chmod(0o755)
            
            print(f"✅ 已安装: {app_name}")
            
        except Exception as e:
            print(f"❌ 安装失败: {e}")

    @staticmethod
    def remove(app_name):
        """移除应用"""
        try:
            install_path = exc.INSTALL_DIR / app_name
            
            if not install_path.exists():
                print(f"❌ 应用未安装: {app_name}")
                return
            
            info_file = install_path / "info.json"
            if info_file.exists():
                info = exc.json.read(info_file)
                print(f"应用: {app_name}")
                if 'description' in info:
                    print(f"描述: {info['description']}")
            
            response = input(f"确认删除？ (y/N): ")
            if response.lower() != 'y':
                return
            
            shutil.rmtree(install_path)
            print(f"✅ 已移除: {app_name}")
            
        except Exception as e:
            print(f"❌ 移除失败: {e}")

    @staticmethod
    def list_apps():
        """列出应用"""
        try:
            if not exc.INSTALL_DIR.exists():
                print("📦 无已安装应用")
                return
            
            apps = [d for d in exc.INSTALL_DIR.iterdir() if d.is_dir()]
            
            if not apps:
                print("📦 无已安装应用")
                return
            
            print("📦 已安装应用:")
            print("-" * 50)
            
            for app_dir in apps:
                app_name = app_dir.name
                info_file = app_dir / "info.json"
                
                if info_file.exists():
                    try:
                        info = exc.json.read(info_file)
                        desc = info.get('description', '无描述')
                        ver = info.get('version', '未知版本')
                        print(f"🔹 {app_name} (v{ver})")
                        print(f"   描述: {desc}")
                    except:
                        print(f"🔹 {app_name} (信息损坏)")
                else:
                    print(f"🔹 {app_name} (无信息文件)")
                
        except Exception as e:
            print(f"❌ 列表失败: {e}")

    @staticmethod
    def run_installed(app_name):
        """运行已安装应用"""
        try:
            install_path = exc.INSTALL_DIR / app_name
            
            if not install_path.exists():
                return False
            
            info_file = install_path / "info.json"
            if not info_file.exists():
                print(f"❌ 信息文件缺失: {app_name}")
                return True

            original_cwd = os.getcwd()
            os.chdir(install_path)
            
            if globals().get('debug'):
                print(f"[DEBUG] 运行应用: {app_name}")
                print(f"[DEBUG] 工作目录: {install_path}")
                args = os.getenv('ARGS', '无')
                print(f"[DEBUG] 应用参数: {args}")
            
            info = exc.json.read('info.json')
            os.system(info['run'])
            
            os.chdir(original_cwd)
            return True
            
        except Exception as e:
            print(f"❌ 运行失败: {e}")
            return True

    def run(file):
        """运行 EXC 文件"""
        try:
            if not os.path.isfile(file):
                raise FileNotFoundError(f"文件不存在: {file}")

            extract_path = os.path.join("temp", exc._get_app_name(file))
            os.makedirs(extract_path, exist_ok=True)

            if globals().get('debug'):
                print(f"[DEBUG] 解压: {file}")

            with zipfile.ZipFile(file, 'r') as zip_file:
                zip_file.extractall(extract_path)

            info_json_path = os.path.join(extract_path, "info.json")
            if not os.path.isfile(info_json_path):
                raise FileNotFoundError("缺少 info.json")

            start_script = os.path.join(extract_path, "start.sh")
            if not os.path.isfile(start_script):
                raise FileNotFoundError("缺少 start.sh")

            os.chmod(start_script, 0o755)

            original_cwd = os.getcwd()
            os.chdir(extract_path)
            
            if globals().get('debug'):
                print(f"[DEBUG] 工作目录: {extract_path}")
                
            info_json_read = exc.json.read('info.json')
            os.system(info_json_read['run'])

            os.chdir(original_cwd)
            exc.clean(extract_path)

        except zipfile.BadZipFile:
            print(f"错误: 无效 EXC 文件")
        except FileNotFoundError as e:
            print(f"错误: {e}")
        except Exception as e:
            print(f"错误: {e}")

    def new(name):
        """创建新项目"""
        try:
            os.makedirs(os.path.join(name, 'main'), exist_ok=True)
            
            start_sh_content = "#!/bin/bash\ncd main\npython3 main.py $ARGS\n"
            start_sh_path = os.path.join(name, "start.sh")
            with open(start_sh_path, "w") as f:
                f.write(start_sh_content)
            
            os.chmod(start_sh_path, 0o755)

            main_py_content = "print('Hello World')\n"
            with open(os.path.join(name, "main", "main.py"), "w") as f:
                f.write(main_py_content)

            info_json_content = {
                "name": name,
                "version": "1.0.0",
                "description": "EXC 应用",
                "run": "./start.sh",
            }

            info_json_path = os.path.join(name, "info.json")
            exc.json.write(info_json_path, info_json_content)
            
            print(f"✅ 项目创建: {name}")
            print(f"💡 使用: exc \"{name} --参数\"")

        except FileExistsError:
            print(f"错误: 项目已存在")
        except Exception as e:
            print(f"错误: {e}")

    def main():
        def char_rainbow_logo():
            logo_lines = [
                r" _______  ______ ",
                r"| ____\ \/ / ___|", 
                r"|  _|  \  / |    ",
                r"| |___ /  \ |___ ",
                r"|_____/_/\_\____|"
            ]
            
            colors = ['\033[91m', '\033[93m', '\033[92m', '\033[96m', '\033[94m', '\033[95m']
            reset = '\033[0m'
            
            for line in logo_lines:
                colored_line = ""
                for j, char in enumerate(line):
                    color = colors[j % len(colors)]
                    colored_line += f"{color}{char}"
                print(colored_line + reset)
        
        args = sys.argv[1:]

        if "--debug" in args:
            args.remove("--debug")
            globals()['debug'] = True
            print("[DEBUG] 调试模式启用")

        # 安装功能
        if "-i" in args or "--install" in args:
            option = "-i" if "-i" in args else "--install"
            index = args.index(option)
            if index + 1 < len(args):
                exc.install(args[index + 1])
            else:
                print("错误: 请指定 EXC 文件")
            return

        # 移除功能
        if "-r" in args or "--remove" in args:
            option = "-r" if "-r" in args else "--remove"
            index = args.index(option)
            if index + 1 < len(args):
                exc.remove(args[index + 1])
            else:
                print("错误: 请指定应用名称")
            return

        # 列出应用
        if "-l" in args or "--list" in args:
            exc.list_apps()
            return

        # 清理
        if "--clean" in args:
            exc.clean("temp")
            return

        # 创建项目
        if "--new" in args:
            index = args.index("--new")
            if index + 1 < len(args):
                exc.new(args[index + 1])
            else:
                print("错误: 请指定项目名")
            return

        # 智能运行
        if args and not any(arg.startswith('-') for arg in args):
            user_input = args[0]
            
            if ' ' in user_input:
                app_name, app_args = user_input.split(' ', 1)
                os.environ['ARGS'] = app_args
                if globals().get('debug'):
                    print(f"[DEBUG] 应用: {app_name}, 参数: {app_args}")
            else:
                app_name = user_input
                if 'ARGS' in os.environ:
                    del os.environ['ARGS']
            
            if exc.run_installed(app_name):
                return
            
            if os.path.isfile(app_name) and app_name.endswith('.exc'):
                exc.run(app_name)
                return
            
            exc_file = app_name + '.exc'
            if os.path.isfile(exc_file):
                exc.run(exc_file)
                return
            
            print(f"❌ 应用未找到: {app_name}")
            print("   - 使用 'exc -l' 查看已安装应用")
            return

        # 显示帮助信息
        char_rainbow_logo()
        print()
        print("用法:")
        print("  exc <应用名>                  # 运行已安装应用")
        print("  exc <文件.exc>                # 运行 EXC 文件") 
        print("  exc \"<应用> <参数>\"           # 运行应用并传递参数")
        print("  exc -i/--install <文件.exc>   # 安装 EXC 应用")
        print("  exc -r/--remove <应用名>      # 移除已安装应用")
        print("  exc -l/--list                 # 列出所有应用")
        print("  exc --new <名称>              # 创建新项目")
        print("  exc --clean                   # 清理临时文件")
        print("  exc --debug                   # 启用调试模式")
        print()
        print("\033[90m本 EXC 具有超级牛力。\033[0m")
        print()

if __name__ == '__main__':
    try:
        exc.main()
    except KeyboardInterrupt:
        print("\n操作取消")
    except Exception as e:
        print(f"错误: {e}")