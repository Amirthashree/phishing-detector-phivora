content = open('server/index.ts', 'r').read()
content = content.replace('host: "0.0.0.0",\n      reusePort: true,', 'host: "localhost",')
open('server/index.ts', 'w').write(content)
print('Done')
